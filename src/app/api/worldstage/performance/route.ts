import {NextResponse} from 'next/server';
import {createPerformance, validatePerformance, type MotionState} from '@/worldstage/solver/director-performance';
import {appendDeparture} from '@/worldstage/solver/departure-performance';
import arrivalText from '@/worldstage/fixed-arrival-encoded.json';

export const runtime = 'nodejs';
export const maxDuration = 10;
// Parse the original decimal text at runtime so build optimizations cannot round saved poses.
const arrival=JSON.parse(arrivalText) as MotionState[];

/** The existing solver is stateless here; each visitor owns their saved takes. */
export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return NextResponse.json({error:'Send directing settings as JSON.'}, {status:415});
  }
  try {
    const text = await request.text();
    if (text.length > 1_000_000) return NextResponse.json({error:'This performance is too large.'}, {status:413});
    const input: unknown = JSON.parse(text);
    if (!input || typeof input !== 'object') throw Error('Choose directing settings.');
    const data = input as Record<string, unknown>;
    const performance = data.action === 'departure'
      ? appendDeparture(validatePerformance(data.performance))
      : data.action === 'audition'
        ? createPerformance(data.settings, arrival as MotionState[])
        : null;
    if (!performance) throw Error('Choose a supported studio action.');
    return NextResponse.json(performance, {headers:{'Cache-Control':'no-store'}});
  } catch {
    return NextResponse.json({error:'The direction could not be simulated. Check cue order, engine timing and settings; departure needs a settled landing.'}, {status:400});
  }
}
