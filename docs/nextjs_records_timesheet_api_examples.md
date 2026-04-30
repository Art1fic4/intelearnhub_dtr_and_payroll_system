# Next.js App Router API/Actions (Reference)

Use these if you move this feature to a Next.js App Router project.

## `app/api/time-logs/route.ts`

```ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const role = searchParams.get('role');
  const status = searchParams.get('status');
  const name = searchParams.get('name');

  let query = supabase.from('time_logs').select('*').order('date', { ascending: false });
  if (role) query = query.eq('role', role);
  if (status) query = query.eq('status', status);
  if (name) query = query.ilike('name', `%${name}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
```

## `app/api/time-logs/[id]/route.ts`

```ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { error } = await supabase.from('time_logs').update(body).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
```

## `app/api/time-logs/batch-approve/route.ts`

```ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function POST(request: Request) {
  const body = await request.json();
  const ids: string[] = body.ids ?? [];
  if (ids.length === 0) return NextResponse.json({ ok: true });

  const { error } = await supabase.from('time_logs').update({ status: 'approved' }).in('id', ids);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, count: ids.length });
}
```
