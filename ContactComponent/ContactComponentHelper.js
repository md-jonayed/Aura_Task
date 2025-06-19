({
    fetchContacts : function(component) {
        var action = component.get("c.getContacts");
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                component.set("v.contacts", response.getReturnValue());
            } else {
                console.error('Failed to fetch contacts: ' + response.getError());
            }
        });
        $A.enqueueAction(action);
    }
})