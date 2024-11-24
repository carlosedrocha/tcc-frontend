import Image from 'next/image';

const HeroComponent = () => {
  return (
    <section>
      <div className="container flex flex-col items-center">
        <div className="w-full text-clip rounded-lg bg-accent/50 2xl:w-[calc(min(100vw-2*theme(container.padding),100%+8rem))]">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="container flex flex-col items-center px-16 py-32 text-center lg:mx-auto lg:items-start lg:px-16 lg:text-left">
              <p>Bem-vindo!</p>
              <h1 className="my-6 text-pretty text-4xl font-bold lg:text-6xl">
                Brew Master
              </h1>
              <p className="mb-8 max-w-xl text-muted-foreground lg:text-xl">
                Gerencie pedidos, controle de estoque e aumente sua
                produtividade com um sistema completo e intuitivo. Descubra como
                a Brew Master pode otimizar sua operação e melhorar a
                experiência dos seus clientes!
              </p>
              <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                {/* <Button className="w-full sm:w-auto">
                  <ArrowRight className="mr-2 size-4" />
                  Primary
                </Button>
                <Button variant="outline" className="w-full sm:w-auto">
                  Secondary
                </Button> */}
              </div>
            </div>
            <Image
              src="https://brew-master-dev.s3.us-east-2.amazonaws.com/FundoTrasnparenteLogo.png"
              alt="company logo"
              height="720"
              width="720"
              className="size-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroComponent;
