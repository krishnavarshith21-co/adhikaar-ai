import { demoMutation } from '@/lib/server/demo-handler';
export const POST = (request: Request) => demoMutation(request, 'reset');
