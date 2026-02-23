declare global {
	interface _G {
		NOCOLOR: boolean;
		__DEV__: boolean;
	}
}

_G.NOCOLOR = true;
_G.__DEV__ = true;

import Jest from '@rbxts/jest';

const [status, result] = Jest.runCLI(script, {}, [script.Parent!]).awaitStatus();

if (status === 'Rejected') error(result);

export = undefined;
