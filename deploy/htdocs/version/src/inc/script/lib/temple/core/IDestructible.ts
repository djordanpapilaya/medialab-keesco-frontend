import refdef from "lib/ReferenceDefinitions";

interface IDestructible
{
	isDestructed():boolean;
	destruct():void;
}

export default IDestructible;