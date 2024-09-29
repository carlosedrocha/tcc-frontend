'use client';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Task, useTaskStore } from '@/lib/store';
import { hasDraggableData } from '@/lib/utils';
import {
  Announcements,
  DndContext,
  DragOverlay,
  MouseSensor,
  TouchSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import type { Column } from './board-column';
import { BoardColumn, BoardContainer } from './board-column';
import NewSectionDialog from './new-section-dialog';
import { TaskCard } from './task-card';
import api from '@/app/api';
// import { coordinateGetter } from "./multipleContainersKeyboardPreset";

const defaultCols = [
  {
    id: 'ORDER_PLACED' as const,
    title: 'A Fazer'
  },
  {
    id: 'ORDER_IN_PROCESS' as const,
    title: 'Em Andamento'
  },
  {
    id: 'ORDER_FINALIZED' as const,
    title: 'Finalizado'
  }
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]['id'];

// const initialTasks: Task[] = [
//   {
//     id: 'task1',
//     status: 'DONE',
//     title: 'Project initiation and planning'
//   },
//   {
//     id: 'task2',
//     status: 'DONE',
//     title: 'Gather requirements from stakeholders'
//   }
// ];

interface KanbanBoardProps {
  data: Task[]; // ou qualquer outro tipo que você esteja passando
}

export const updateTaskApi = async (taskId: string, status: string) => {
  try {
    const response = await api.put(`/kanban`, {
      orderId: taskId,
      status: status // Mantendo `id` e `status` no corpo da requisição
    });

    // Verifica se a resposta é bem-sucedida
    if (response.status !== 200) {
      throw new Error(`Failed to update task: ${response.statusText}`);
    }

    return response.data; // Retorne a tarefa atualizada, se necessário
  } catch (error) {
    console.error('Error updating task:', error);
    throw error; // Propaga o erro para ser tratado onde a função for chamada
  }
};
export function KanbanBoard({ data }: KanbanBoardProps) {
  // const [columns, setColumns] = useState<Column[]>(defaultCols);
  const columns = useTaskStore((state) => state.columns);
  const setColumns = useTaskStore((state) => state.setCols);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [isMounted, setIsMounted] = useState<Boolean>(false);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
    // useSensor(KeyboardSensor, {
    //   coordinateGetter: coordinateGetter,
    // }),
  );

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  useEffect(() => {
    useTaskStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (data) {
      setTasks(data);
    }
  }, [data, setTasks]);

  if (!isMounted) return;

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.status === columnId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column
    };
  }

  function updateTaskStatus(taskId: string, newStatus: string) {
    updateTaskApi(taskId, newStatus)
      .then((response) => {})
      .catch((error) => {});
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === 'Column') {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === 'Task') {
        pickedUpTaskColumn.current = active.data.current.task.status;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current ?? 'ORDER_PLACED'
        );
        return `Picked up Task ${active.data.current.task.title} at position: ${
          taskPosition + 1
        } of ${tasksInColumn.length} in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.status
        );
        if (over.data.current.task.status !== pickedUpTaskColumn.current) {
          return `Task ${
            active.data.current.task.title
          } was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);
        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Column' // Alterado para verificar se a tarefa foi solta em uma coluna
      ) {
        const newStatus = over.data.current.column.status; // Obtenha o novo status da coluna
        const taskId = String(active.id); // ID da tarefa

        // Função que atualiza o status da tarefa
        updateTaskStatus(taskId, newStatus); // Chame a função para atualizar o status

        return `Task ${active.data.current.task.title} was dropped into column ${over.data.current.column.title}`;
      } else if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.status
        );
        if (over.data.current.task.status !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    }
  };

  return (
    <DndContext
      accessibility={{
        announcements
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns?.map((col, index) => (
            <Fragment key={col.id}>
              <BoardColumn
                column={col}
                tasks={tasks.filter((task) => task.status === col.id)} // Você pode manter isso, se necessário
                data={data} // Passando todos os dados
              />
              {index === columns.length - 1 && (
                <div className="w-[300px]">
                  <NewSectionDialog />
                </div>
              )}
            </Fragment>
          ))}
          {!columns.length && <NewSectionDialog />}
        </SortableContext>
      </BoardContainer>

      {'document' in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks.filter((task) => task.status === activeColumn.id)}
                data={data}
              />
            )}
            {activeTask && <TaskCard task={activeTask} isOverlay data={data} />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === 'Column') {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === 'Task') {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    const isActiveAColumn = activeData?.type === 'Column';

    if (!isActiveAColumn === true) {
      const newStatus = over.data.current?.task?.status; // Obter o novo status da coluna

      if (newStatus) {
        // Chamar a função de atualização de status da tarefa
        updateTaskStatus(String(activeId), newStatus);
      } else {
        console.warn('Column status não definido em over.data.current');
      }
    } else {
      // Mover a coluna
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);
      setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex));
    }

    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    // Mover a coluna
    setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex));
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === 'Task';
    const isOverATask = activeData?.type === 'Task';

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);
      const activeTask = tasks[activeIndex];
      const overTask = tasks[overIndex];
      if (activeTask && overTask && activeTask.status !== overTask.status) {
        activeTask.status = overTask.status;
        setTasks(arrayMove(tasks, activeIndex, overIndex - 1));
      }

      setTasks(arrayMove(tasks, activeIndex, overIndex));
    }

    const isOverAColumn = overData?.type === 'Column';

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const activeTask = tasks[activeIndex];
      if (activeTask) {
        activeTask.status = overId as ColumnId;
        setTasks(arrayMove(tasks, activeIndex, activeIndex));
      }
    }
  }
}
