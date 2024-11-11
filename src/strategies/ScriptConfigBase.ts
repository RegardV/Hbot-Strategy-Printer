export class ScriptConfigBase {
  scriptFileName: string = '';
  
  constructor(config?: Partial<ScriptConfigBase>) {
    if (config) {
      Object.assign(this, config);
    }
  }
}