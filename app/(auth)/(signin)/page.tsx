import { Metadata } from 'next';
import Link from 'next/link';
import UserAuthForm from '@/components/forms/user-auth-form';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Login',
  description: '',
  icons:
    'https://brew-master-dev.s3.us-east-2.amazonaws.com/FundoTrasnparenteLogo.png'
};

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg viewBox="0 0 24 24" className="mr-2 h-6 w-6">
            <image
              href="https://brew-master-dev.s3.us-east-2.amazonaws.com/FundoTrasnparenteLogo.png"
              x="0"
              y="0"
              height="24"
              width="24"
            />
          </svg>
          Brew Master
        </div>
        <div className="relative m-auto">
          <svg viewBox="0 0 1000 1000" className="mr-2 h-full w-full">
            <image
              href="https://brew-master-dev.s3.us-east-2.amazonaws.com/FundoTrasnparenteLogo.png"
              x="0"
              y="0"
              height="1000"
              width="1000"
            />
          </svg>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Realize o Login
            </h1>
            <p className="text-sm text-muted-foreground">
              Coloque seu e-mail e sua senha abaixo:
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  );
}
