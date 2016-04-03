import IRoleData from "IRoleData";
import ISkillData from "ISkillData";

interface IUserData {
	user:Users;
}

export default IUserData;

interface IAssignments {
	id:number;
	level:number;
	name:string;
	skillName:string
}

interface Users {
	id:number;
	firstName:string;
	lastName:string;
	email:string;
	role:IRoleData;
	completed_assignments:IAssignments;
	Skills:ISkillData;
}