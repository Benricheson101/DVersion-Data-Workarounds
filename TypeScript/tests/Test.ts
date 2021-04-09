import { Base } from "../lib/Base";

const base = new Base();
base.getVersionData('canary').then(console.log);

const anotherBase = new Base({ cli: "canary" });
anotherBase.getVersionData().then(console.log);
