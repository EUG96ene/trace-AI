import {getSession} from 'next-auth/react';
import {GetServerSidePropsContext} from 'next';
import { Session } from 'next-auth';

function RequireAuthentication(getServerSidePropsFunc: { (ctx: GetServerSidePropsContext): Promise<{ props: { session: Session | null; }; }>; (arg0: GetServerSidePropsContext, arg1: { name?: string | null | undefined; email?: string | null | undefined; image?: string | null | undefined; } | undefined): any; }) {
  return async (ctx: GetServerSidePropsContext) => {
    const session = await getSession(ctx);

    if (!session)
      return {
        redirect: {
          destination: '/auth',
          permanent: false,
        },
      };

    const user = session.user;

    return await getServerSidePropsFunc(ctx, user);
  };
}

export default RequireAuthentication;
