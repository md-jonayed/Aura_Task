({
    fetchOpportunities : function(component) {
        var action = component.get("c.getOpportunities");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                component.set("v.opportunities", response.getReturnValue());
            } else {
                console.error('Failed to fetch opportunities: ' + response.getError());
            }
        });
        $A.enqueueAction(action);
    }
})