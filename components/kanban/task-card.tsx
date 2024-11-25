import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { GripVertical } from 'lucide-react';
import { Badge } from '../ui/badge';

interface TaskCardProps {
  task: {
    id: string;
    status: string | null; // O status pode ser null
    tab: {
      id: string;
      tabNumber: number; // Número da tab
      total: number | null; // O total pode ser null
      status: string; // O status do tab
    };
    dishesOrder: {
      dish: {
        name: string; // Nome do prato
      };
      createdAt: string; // Campo para a data de criação
    }[];
    title?: string; // Torne 'title' opcional
  };
  isOverlay?: boolean;
  data: any[]; // Ou substitua por um tipo mais específico se necessário
}

export function TaskCard({ task, isOverlay, data }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task
    },
    attributes: {
      roleDescription: 'Task'
    }
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform)
  };

  const variants = cva('', {
    variants: {
      dragging: {
        over: 'ring-2 opacity-30',
        overlay: 'ring-2 ring-primary'
      }
    }
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined
      })}
    >
      <CardHeader className="space-between relative flex flex-row border-b-2 border-secondary px-3 py-3">
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className="-ml-2 h-auto cursor-grab p-1 text-secondary-foreground/50"
        >
          <span className="sr-only">Move task</span>
          <GripVertical />
        </Button>
        <Badge variant={'outline'} className="ml-auto font-semibold">
          Task
        </Badge>
      </CardHeader>
      <CardContent className="whitespace-pre-wrap px-3 pb-6 pt-3 text-left">
        {/* Exibindo o número da tab */}
        <div className="mb-3">
          <span className="font-semibold">Número da comanda: </span>
          {task.tab.tabNumber} {/* Exibindo o número da tab */}
        </div>

        {/* Exibindo o nome do prato e a data de criação */}
        <ul>
          {task.dishesOrder.map((order, index) => (
            <li key={index} className="mb-2">
              <div>
                <span className="font-semibold">Pedido: </span>
                {order.dish.name} {/* Exibindo nome do prato */}
              </div>
              <div>
                <span className="font-semibold">Horário do pedido: </span>
                {new Date(order.createdAt).toLocaleTimeString()}
                {/* Exibindo a data de criação */}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
