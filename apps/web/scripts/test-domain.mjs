import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
const tscPath = createRequire(import.meta.url).resolve('typescript/bin/tsc');
const build=mkdtempSync(join(tmpdir(),'adhikaar-tests-'));
try {
 const compile=spawnSync(process.execPath,[tscPath,'--module','commonjs','--target','es2022','--esModuleInterop','--skipLibCheck','--outDir',build,'src/lib/domain/model.ts','src/lib/domain/catalog.ts','src/lib/domain/eligibility.ts','src/lib/domain/demo-fixture.ts','src/lib/domain/actions.ts','src/lib/domain/assistant.ts','src/lib/server/demo-session-store.ts','src/lib/server/origin-policy.ts','src/lib/domain/speech-audio.ts','src/lib/server/transcription.ts','src/lib/server/ai-provider.ts'],{stdio:'inherit'});
 if(compile.status) process.exitCode=compile.status;
 else process.exitCode=spawnSync(process.execPath,['--test',...(process.argv.includes('--speech-only') ? ['tests/speech.test.mjs'] : ['tests/domain.test.cjs','tests/origin-policy.test.mjs','tests/speech.test.mjs','tests/ai-provider.test.mjs'])],{stdio:'inherit',env:{...process.env,DOMAIN_BUILD:build}}).status || 0;
} finally { rmSync(build,{recursive:true,force:true}); }
