describe('Test Schedule.js', ()=>{
    describe('Test stand alone functions', ()=>{
        it('Test build template', ()=>{
            let requirements = [{
                start: 8,
                end: 12,
                minPeople: 1
            },{
                start: 11,
                end: 15.5,
                minPeople: 2
            },{
                start: 14,
                end: 18
            }];
            let template = buildTemplate(requirements);
            expect(template).toEqual([0,0,0,0,0,0,0,0, // 0 ~ 3.5
                                      0,0,0,0,0,0,0,0, // 4 ~ 7.5
                                      1,1,1,1,1,1,2,2, // 8 ~ 11.5
                                      2,2,2,2,2,2,2,1, // 12 ~ 15.5
                                      1,1,1,1,0,0,0,0, // 16 ~ 19.5
                                      0,0,0,0,0,0,0,0, // 20 ~ 23.5
                                      ]);
        });

        it('Test interval to day list', ()=>{
            let intervals = [{
                                day: 0,
                                start: 5,
                                end: 8,
                                minPeople: 2
                            },{
                                day: 1,
                                start: 5,
                                end: 8,
                                minPeople: 1
                            },{
                                day: 0,
                                start: 12,
                                end: 15,
                                minPeople: 1
                            },{
                                day: 3,
                                start: 5,
                                end: 8,
                                minPeople: 2
                            },{
                                day: 7,
                                start: 5,
                                end: 8,
                                minPeople: 2
                            }];
            let intervalList = intervalToDayList(intervals);
            expect(intervalList[0]).toEqual([{
                                                day: 0,
                                                start: 5,
                                                end: 8,
                                                minPeople: 2
                                            },{
                                                day: 0,
                                                start: 12,
                                                end: 15,
                                                minPeople: 1
                                            },{
                                                day: 7,
                                                start: 5,
                                                end: 8,
                                                minPeople: 2
                                            }]);
            expect(intervalList[1]).toEqual([{
                                        day: 1,
                                        start: 5,
                                        end: 8,
                                        minPeople: 1
                                    },{
                                        day: 7,
                                        start: 5,
                                        end: 8,
                                        minPeople: 2
                                    }]);
        });

        // it('Test build daily schedule models', ()=>{
        //     var m = {
        //         a: 'b',
        //         c: 'd'
        //     };
        //     Object.keys(m).forEach(function(key) {
        //         var value = m[key];
        //         console.log(key, value);
        //     });
        // });
    });

    describe('Test Daily Schedule Model', ()=>{

    });

    describe('Test Schedule Model', ()=>{
        let scheduleInfoEmpty = {
            roles: {},
            staffs: {},
            requirements: []
        };

        it('Test set requirements', ()=>{
            let requirements = [{
                                day: 0,
                                start: 12,
                                end: 15,
                                minPeople: 1
                            },{
                                day: 3,
                                start: 5,
                                end: 8,
                                minPeople: 2
                            },{
                                day: 7,
                                start: 5,
                                end: 7,
                                minPeople: 2
                            }];
            let scheduleModel = new ScheduleModel(scheduleInfoEmpty);
            scheduleModel.setRequirements(requirements);
            expect(scheduleModel.scheduleList[0].requirementModel)
                .toEqual(new RequirementModel([{
                                day: 0,
                                start: 12,
                                end: 15,
                                minPeople: 1
                            },{
                                day: 7,
                                start: 5,
                                end: 7,
                                minPeople: 2
                            }]));
        });

        it('Test add staffs', ()=>{
            let staffs = {
                staffId1: {
                    roleId: 'roleId1',
                    avails: [{
                                day: 0,
                                start: 5,
                                end: 8,
                            },{
                                day: 1,
                                start: 5,
                                end: 8,
                            },{
                                day: 7,
                                start: 5,
                                end: 8,
                            }]
                },
                staffId2: {
                    avails: [{
                                day: 0,
                                start: 12,
                                end: 15,
                            },{
                                day: 3,
                                start: 5,
                                end: 8,
                            },{
                                day: 6,
                                start: 5,
                                end: 8,
                            }]
                }
            }
            let scheduleModel = new ScheduleModel(scheduleInfoEmpty);
            scheduleModel.addStaffs(staffs);
            expect(scheduleModel.scheduleList[0].staffs).toEqual([
                new StaffModel('staffId1', 'roleId1', [{
                                day: 0,
                                start: 5,
                                end: 8,
                            },{
                                day: 7,
                                start: 5,
                                end: 8,
                            }]),
                new StaffModel('staffId2', null, [{
                                day: 0,
                                start: 12,
                                end: 15,
                            }])
                ]);
        });

        it('Test add roles', ()=>{
            let roles = {
                roleId1: {
                    times: [{
                                day: 0,
                                start: 5,
                                end: 8,
                                minPeople: 2
                            },{
                                day: 1,
                                start: 5,
                                end: 8,
                                minPeople: 1
                            },{
                                day: 7,
                                start: 5,
                                end: 8,
                                minPeople: 2
                            }]
                        },
                roleId2: {
                    times: [{
                                day: 0,
                                start: 12,
                                end: 15,
                                minPeople: 1
                            },{
                                day: 3,
                                start: 5,
                                end: 8,
                                minPeople: 2
                            },{
                                day: 6,
                                start: 5,
                                end: 8,
                                minPeople: 2
                            }]
                    }
                };
            let scheduleModel = new ScheduleModel(scheduleInfoEmpty);
            scheduleModel.addRoles(roles);
            expect(scheduleModel.scheduleList[0].roles).toEqual([
                new RoleModel('roleId1', [{
                                day: 0,
                                start: 5,
                                end: 8,
                                minPeople: 2
                            },{
                                day: 7,
                                start: 5,
                                end: 8,
                                minPeople: 2
                            }]),
                new RoleModel('roleId2', [{
                                day: 0,
                                start: 12,
                                end: 15,
                                minPeople: 1
                            }])]);
        });
    });

    describe('Test Staff Model', ()=>{
        it('Test calc available sections.', ()=>{
            spyOn(window, 'buildTemplate').and.returnValue([1,1,0,0,1,1,0,0,0]);
            let staff = new StaffModel('staff', 'roleId', 'availability');
            expect(staff.availableSections).toEqual(4);
        });
        it('Test calc max sections less than max hour day.', ()=>{
            spyOn(window, 'buildTemplate');
            spyOn(StaffModel.prototype, 'calcAvailableSections').and.returnValue(8);
            let staff = new StaffModel('staff', 'roleId', 'availability');
            expect(staff.maxSections).toEqual(8);
        });
        it('Test calc max sections larger than max hour day.', ()=>{
            spyOn(window, 'buildTemplate');
            spyOn(StaffModel.prototype, 'calcAvailableSections').and.returnValue(20);
            let staff = new StaffModel('staff', 'roleId', 'availability');
            expect(staff.maxSections).toEqual(16);
        });
    });
});
