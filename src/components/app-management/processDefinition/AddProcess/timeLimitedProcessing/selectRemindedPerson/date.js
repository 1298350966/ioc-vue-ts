export default {
    receiverType: [
        { id: '0', name: "角色" },
        { id: '1', name: "指定人" },
        { id: '2', name: "主管" },
        { id: '3', name: "发起人自己" },
        { id: '4', name: "表单内用户控件值" },
        { id: '5', name: "组织+角色" },
        { id: '6', name: "表单内用户控件值所属部门+角色" },
        { id: '7', name: "发起人所属部门+角色" },
        { id: '8', name: "表单内部门控件值+角色" },
        { id: '9', name: "条件+接收人" },
        { id: '10', name: "处理人主管" },
        { id: '11', name: "处理人所属部门+角色" },
    ],
    //主管
    executiveDirectorOptions:[
        {
            value: "1",
            label: "直接主管",
        },
        {
            value: "2",
            label: "2级主管",
        },
        {
            value: "3",
            label: "3级主管",
        },
        {
            value: "4",
            label: "4级主管",
        },
        {
            value: "5",
            label: "5级主管",
        },
    ],
    //处理人
    receiver(obj){
        if (!obj && !obj.type) return "";
      if (obj.type == 0) {
        return obj.role.map((value) => value.roleName).join("、");
      } else if (obj.type == 1) {
        return obj.person.map((value) => value.name).join("、");
      } else if (obj.type == 2) {
        return obj.leader == 1 ? "直接主管" : obj.leader + "级主管";
      } else if (obj.type == 3) {
        return "发起人自己";
      } else if (obj.type == 4) {
        return this.modelName(obj.model);
      } else if (obj.type == 5) {
        return obj.orgAndRole
          .map((value, index, array) => {
            return value.orgName + "+" + value.roleName;
          })
          .join("、");
      } else if (obj.type == 6) {
        return obj.dyncUserAndRole
          .map((value) => {
            return this.modelName(value.model) + "+" + value.roleName;
          })
          .join("、");
      } else if (obj.type == 7) {
        return obj.cuserOrgAndRole
          .map((value) => {
            return value.roleName;
          })
          .join("、");
      } else if (obj.type == 8) {
        return obj.dyncOrgAndRole
          .map((value) => {
            return this.modelName(value.model) + "+" + value.roleName;
          })
          .join("、");
      } else if(obj.type == 10){
         return obj.dealingLeader == 1 ? "处理人直接主管" : "处理人" + obj.dealingLeader + "级主管";
      }else if(obj.type == 11){
        let name =  obj.dealingOrgAndRole.map((value) => {
            return "处理人所属部门" + value.roleName;
          })
          .join("、");
        if(name){
          return  name
        }else{
          return ''
        }
      }
    }

}