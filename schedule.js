var settings = {
    maxHSD: 8,
    minHSD: 2,
    maxHSW: 40,
    minHSW: 0,
}

const hourToSection = 2;
const hourInDay = 24;
const numDays = 7;

/*
requirements = [
    {
        start: number,
        end: number,
        minPeople: number
    }
]
*/
function buildTemplate(requirements){
    var template = [];
    for (var i = 0; i < hourInDay * hourToSection; i++) {
        template.push(0);
    }
    requirements.forEach(function(requirement) {
        for (var i = requirement.start * hourToSection;
            i < requirement.end * hourToSection; i++) {
            var minPeople = 1;
            if (requirement.minPeople !== undefined){
                minPeople = requirement.minPeople;
            }
            template[i] = Math.max(template[i], minPeople);
        }
    });
    return template;
}

class StaffModel{
    constructor(staffId, roleId, availabilities){
        this.staffId = staffId;
        this.roleId = roleId;
        this.template = buildTemplate(availabilities);
        this.availableSections = this.calcAvailableSections();
        this.maxSections = Math.min(this.availableSections, settings.maxHSD * hourToSection);
    }

    calcAvailableSections(){
        return this.template.reduce(function(total, num){
            return total + num;
        });
    }
}

class RoleModel{
    constructor(roleId, requirements){
        this.roleId = roleId;
        this.template = buildTemplate(requirements);
    }
}

class RequirementModel{
    constructor(requirements){
        this.template = buildTemplate(requirements);
    }
}

class DailySolutionModel{
    constructor(){

    }
}

class DailyScheduleModel{
    constructor(){
        this.roles = []; // list<RoleModel>
        this.staffs = []; // list<StaffModel>
        this.requirementModel = null; // RequirementModel
    }

    // Main function to schedule each day
    solve(){

    }
}

function intervalToDayList(intervals){
    var intervalList = [];
    for (var i = 0; i < numDays; i++){
        intervalList.push([]);
    }
    intervals.forEach(function(interval){
        if (interval.day == numDays){
            intervalList.forEach(function(intervalItem){
                intervalItem.push(interval);
            });
        }
        else{
            intervalList[interval.day].push(interval);
        }
    });
    return intervalList;
}

class ScheduleModel{
    constructor(scheduleInfo){
        this.scheduleList = [];
        for (var i = 0; i < 7; i++) {
            this.scheduleList.push(new DailyScheduleModel());
        }
        this.addRoles(scheduleInfo.roles);
        this.addStaffs(scheduleInfo.staffs);
        this.setRequirements(scheduleInfo.requirements);
    }

    // Main function to schedule
    solve(){
        this.scheduleList.forEach(function(dailySchedule){
            dailySchedule.solve();
        });
    }

    setRequirements(requirements){
        let requirementsList = intervalToDayList(requirements);
        for (var i = 0; i < numDays; i++){
            this.scheduleList[i].requirementModel = new RequirementModel(requirementsList[i]);
        }
    }

    addStaffs(staffs){
        let scheduleModel = this;
        Object.keys(staffs).forEach(function(staffId){
            let staff = staffs[staffId];
            let availsList = intervalToDayList(staff.avails);
            for (var i = 0; i < numDays; i++){
                let roleId = null;
                if (staff.roleId !== undefined){
                    roleId = staff.roleId;
                }
                let staffModel = new StaffModel(staffId, roleId, availsList[i]);
                scheduleModel.scheduleList[i].staffs.push(staffModel);
            }
        });
    }

    addRoles(roles){
        let scheduleModel = this;
        Object.keys(roles).forEach(function(roleId){
            let role = roles[roleId];
            var roleRequirements = intervalToDayList(role.times);
            for (var i = 0; i < numDays; i++) {
                let roleRequirement = roleRequirements[i];
                if (roleRequirement.length > 0){
                    let roleModel = new RoleModel(roleId, roleRequirements[i]);
                    scheduleModel.scheduleList[i].roles.push(roleModel);
                }
            }
        });
    }
}

function schedule(scheduleInfo){
    let scheduleModel = new ScheduleModel(scheduleInfo);
    scheduleModel.solve();
}
