(function () {
    var session = null,
        arrayType = typeof [],
        myUserData = null,
        save = function ($cookieStore) {
            if (myUserData != null) {
                $cookieStore.put('user-properties', JSON.stringify(myUserData));
            }
        };
    define([], function () {
        if (session == null) {
            session = {
                init: function ($cookieStore, user) {
                    if (!!user && !!user.Token && user.Token != '') {
                        myUserData = user;
                        save($cookieStore);
                    }
                    return myUserData != null;
                },
                clear: function ($cookieStore) {
                    myUserData = null;
                    $cookieStore.remove('user-properties');
                },
                isLogged: function () { return myUserData != null; },
                hasPermission: function (rolesGranted, systemId) {
                    if (typeof rolesGranted != arrayType) {
                        rolesGranted = [rolesGranted];
                    }
                    /// verificar se o usuario é gestor do sistema

                    if (rolesGranted.length > 0) {
                        return rolesGranted.filter(function (val, idx) {
                            return myUserData.UserRoles.indexOf(val) >= 0;
                        }).length > 0;
                    } else {
                        return true;
                    }
                },
                getUserLogged: function () {
                    if (myUserData != null) {
                        return myUserData;
                    }
                    else return null;
                },
                getUserAccessSettings: function () {
                    return userAccessSettings;
                },
                setUserAccessSettings: function (nval) {
                    userAccessSettings = nval;
                },
                workflow: {
                    items: function () {
                        return workflow === undefined || workflow === null ? [] : workflow;
                    },
                    'new': function (nval) {
                        workflow = nval;
                        workflow.currentStep = null;
                        workflow.indexCurrentStep = -1;
                    },
                    getCurrentStep: function () {
                        return workflow.currentStep;
                    },
                    movePrevious: function ($location) {
                        workflow.currentStep = workflow[workflow.indexCurrentStep > 0 ? --workflow.indexCurrentStep : 0];
                        $location.path(workflow.currentStep.path);
                    },
                    moveNext: function ($location, index) {
                        if (index >= 0) {
                            workflow.indexCurrentStep = --index;
                        }
                        workflow.currentStep = workflow[++workflow.indexCurrentStep];
                        this.clearEvents();
                        workflow.forEach(function (item, idx) {
                            item.isActive = (idx <= workflow.indexCurrentStep);
                        });
                        $location.path(workflow.currentStep.path);
                    },
                    clearEvents: function () {
                        session.workflow.onMoveNext = null;
                    }
                }
            };
        }
        return session;
    });
})();