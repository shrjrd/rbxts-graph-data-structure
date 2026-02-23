for (const [key] of pairs(_G)) {
	if (typeIs(key, 'Instance') && key.IsA('ModuleScript')) {
		_G[key as unknown as keyof typeof _G] = undefined as unknown as (typeof _G)[keyof typeof _G];
	}
}

export = script as ModuleScript;
