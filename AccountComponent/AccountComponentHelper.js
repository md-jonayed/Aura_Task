({
    fetchAccounts : function(component) {
        var action = component.get("c.getAccounts");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                component.set("v.accounts", response.getReturnValue());
            } else {
                console.error('Failed to fetch accounts: ' + response.getError());
            }
        });
        $A.enqueueAction(action);
    }
})