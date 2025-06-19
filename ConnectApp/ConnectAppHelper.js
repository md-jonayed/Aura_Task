({
    loadPicklists: function(component) {
        var action = component.get("c.fetchPicklistData"); // Refers to the Apex method
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var picklistData = response.getReturnValue();
                component.set("v.contactOptions", picklistData.contacts);
                component.set("v.accountOptions", picklistData.accounts);
                component.set("v.opportunityOptions", picklistData.opportunities);
            } else if (state === "ERROR") {
                var errors = response.getError();
                var errorMessage = 'Unknown error fetching picklist data';
                if (errors && errors[0] && errors[0].message) {
                    errorMessage = errors[0].message;
                }
                console.error("Error fetching picklist data: ", errorMessage);
                this.showToast('Error', errorMessage, 'error');
            }
        });
        $A.enqueueAction(action);
    },

    loadConnections: function(component) {
        var action = component.get("c.fetchConnections"); // Refers to the Apex method
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var connections = response.getReturnValue();
                component.set("v.connections", connections); // Set the connections attribute
            } else if (state === "ERROR") {
                var errors = response.getError();
                var errorMessage = 'Unknown error fetching connections';
                if (errors && errors[0] && errors[0].message) {
                    errorMessage = errors[0].message;
                }
                console.error("Error fetching connections: ", errorMessage);
                this.showToast('Error', errorMessage, 'error');
            }
        });
        $A.enqueueAction(action);
    },

    // Helper method to display toast messages
    showToast: function(title, message, type) {
        var toastEvent = $A.get("e.force:showToast");
        if (toastEvent) { // Check if the event is supported (e.g., Lightning Experience, Salesforce Mobile App)
            toastEvent.setParams({
                "title": title,
                "message": message,
                "type": type, // 'success', 'error', 'warning', 'info'
                "mode": "dismissible" // or 'pester', 'sticky'
            });
            toastEvent.fire();
        } else {
            // Fallback for communities or older contexts where force:showToast is not available
            alert(title + ': ' + message);
        }
    }
})