import { Timer, Zap, ZoomIn } from 'lucide-react';

const FeatureComponent = () => {
  return (
    <section className="py-32">
      <div className="container">
        <p className="mb-4 text-sm text-muted-foreground lg:text-base">
          Nossos Valores
        </p>
        <h2 className="text-3xl font-medium lg:text-4xl">
          Por que escolher a gente?
        </h2>
        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-3">
          <div className="rounded-lg bg-accent p-5">
            <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-background">
              <Timer className="size-6" />
            </span>
            <h3 className="mb-2 text-xl font-medium">Performance</h3>
            <p className="leading-7 text-muted-foreground">
              Nossa plataforma foi construída para proporcionar uma operação
              fluida e sem interrupções, mesmo durante os períodos de maior
              movimento. A velocidade e eficiência do Brew Master garantem que
              você possa focar no que realmente importa: seus clientes.
            </p>
          </div>
          <div className="rounded-lg bg-accent p-5">
            <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-background">
              <ZoomIn className="size-6" />
            </span>
            <h3 className="mb-2 text-xl font-medium">Qualidade</h3>
            <p className="leading-7 text-muted-foreground">
              Desenvolvido com tecnologias de ponta, o Brew Master oferece uma
              experiência de uso intuitiva, confiável e sem falhas. Estamos
              sempre atentos aos detalhes para entregar o melhor sistema para o
              seu negócio.
            </p>
          </div>
          <div className="rounded-lg bg-accent p-5">
            <span className="mb-8 flex size-12 items-center justify-center rounded-full bg-background">
              <Zap className="size-6" />
            </span>
            <h3 className="mb-2 text-xl font-medium">Adaptabilidade</h3>
            <p className="leading-7 text-muted-foreground">
              Sabemos que cada bar e restaurante tem suas peculiaridades. O Brew
              Master se adapta facilmente às suas necessidades específicas, seja
              na gestão de múltiplos locais, personalização de cardápios ou
              controle de estoque.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureComponent;
