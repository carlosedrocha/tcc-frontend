import Image from 'next/image';

const sections = [
  {
    title: 'Produto',
    links: [
      { name: 'Overview', href: '#' },
      { name: 'Preço', href: '#' },
      { name: 'Funcionalidades', href: '#' }
    ]
  },
  {
    title: 'Empresa',
    links: [
      { name: 'Sobre', href: '#' },
      { name: 'Contato', href: '#' },
      { name: 'Privacidade', href: '#' }
    ]
  },
  // {
  //   title: 'Resources',
  //   links: [
  //     { name: 'Ajuda', href: '#' },
  //   ]
  // },
  {
    title: 'Social',
    links: [
      { name: 'Instagram', href: '#' },
      { name: 'LinkedIn', href: '#' }
    ]
  }
];

const FooterComponent = () => {
  return (
    <section className="py-32">
      <div className="container">
        <footer>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-6">
            <div className="col-span-2 mb-8 lg:mb-0">
              <Image
                src="https://brew-master-dev.s3.us-east-2.amazonaws.com/FundoTrasnparenteLogo.png"
                alt="company logo"
                className="mb-4 h-7"
                width={24}
                height={24}
              />
              <p className="font-bold">BrewMaster.</p>
            </div>
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-4 font-bold">{section.title}</h3>
                <ul className="space-y-4 text-muted-foreground">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-medium hover:text-primary"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-24 flex flex-col justify-between gap-4 border-t pt-8 text-sm font-medium text-muted-foreground md:flex-row md:items-center">
            <p>© 2024 BrewMaster. Todos direitos reservados.</p>
            <ul className="flex gap-4">
              <li className="underline hover:text-primary">
                <a href="#"> Termos e Condições</a>
              </li>
              <li className="underline hover:text-primary">
                <a href="#"> Política de Privacidade</a>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </section>
  );
};

export default FooterComponent;
