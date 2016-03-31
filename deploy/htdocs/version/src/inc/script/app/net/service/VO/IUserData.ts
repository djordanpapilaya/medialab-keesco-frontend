import IRoleData from "IRoleData";
import ISkillData from "ISkillData";

interface IUserData {
	id:number;
	firstName:string;
	lastName:string;
	email:string;
	role:IRoleData;
	completed_assignments:IAssignments;
	Skills:ISkillData;
}

export default IUserData;

interface IAssignments {
	id:number;
	level:number;
	name:string;
}