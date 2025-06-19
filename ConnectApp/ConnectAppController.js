({
    doInit: function(component, event, helper) {
        helper.loadPicklists(component);
        helper.loadConnections(component);
    },

    openModal: function(component, event, helper) {
        component.set("v.isModalOpen", true);
        // Clear previous selections when opening the modal for a new entry
        component.set("v.contactId", '');
        component.set("v.accountId", '');
        component.set("v.opportunityId", '');
    },

    closeModal: function(component, event, helper) {
        component.set("v.isModalOpen", false);
        // Clear selections when closing the modal
        component.set("v.contactId", '');
        component.set("v.accountId", '');
        component.set("v.opportunityId", '');
    },

    handleContactChange: function(component, event, helper) {
        var selectedContactId = event.target.value;
        component.set('v.contactId', selectedContactId);

        // Reset Account and Opportunity when contact changes, unless it's a pre-fill scenario
        component.set('v.accountId', '');
        component.set('v.opportunityId', '');

        if (selectedContactId) {
            // Call Apex to get existing connection data for the selected contact
            var action = component.get("c.getContactWithAccount"); // This method should fetch the existing Connection__c not just Contact
            action.setParams({ contactId: selectedContactId }); // Passing contactId to Apex method

            action.setCallback(this, function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    var contactRecord = response.getReturnValue();
                    console.log('Contact with Account fetched: ', JSON.stringify(contactRecord));
                    // Assuming getContactWithAccount returns a Contact record with AccountId
                    if (contactRecord && contactRecord.AccountId) {
                        component.set("v.accountId", contactRecord.AccountId);
                        // If you also want to pre-fill Opportunity, you'd need a similar lookup in Apex
                        // or modify the Apex method to return the full Connection__c record if it exists
                    } else {
                        // If no account is directly linked via contact (or no existing connection found), ensure account is empty
                        component.set("v.accountId", '');
                    }
                } else if (state === "ERROR") {
                    var errors = response.getError();
                    var errorMessage = 'Unknown error';
                    if (errors && errors[0] && errors[0].message) {
                        errorMessage = errors[0].message;
                    }
                    console.error("Error fetching contact account: ", errorMessage);
                    // Optionally show a toast message to the user
                    helper.showToast('Error', errorMessage, 'error');
                }
            });
            $A.enqueueAction(action);
        } else {
            // If contact is cleared, clear account and opportunity as well
            component.set("v.accountId", '');
            component.set("v.opportunityId", '');
        }
    },

    handleAccountChange: function(component, event, helper) {
        var selectedAccountId = event.target.value;
        component.set('v.accountId', selectedAccountId);
        console.log('Selected Account ID:', selectedAccountId);
    },

    handleOpportunityChange: function(component, event, helper) {
        var selectedOpportunityId = event.target.value;
        component.set('v.opportunityId', selectedOpportunityId);
        console.log('Selected Opportunity ID:', selectedOpportunityId);
    },

    saveConnection: function(component, event, helper) {
        var contactId = component.get("v.contactId");
        var accountId = component.get("v.accountId");
        var opportunityId = component.get("v.opportunityId");

        console.log('Attempting to save with:', { contactId, accountId, opportunityId });

        // Basic client-side validation
        if (!contactId || !accountId || !opportunityId) { // Check for truthy values (not null, undefined, or empty string)
            helper.showToast('Validation Error', 'All fields are required.', 'error');
            return;
        }

        var action = component.get("c.saveConnectionApex"); // Correctly refers to the Apex method
        action.setParams({
            contactId: contactId,
            accountId: accountId,
            opportunityId: opportunityId
        });

        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('Connection saved successfully. New ID:', response.getReturnValue());
                helper.showToast('Success', 'Connection saved successfully!', 'success');
                component.set("v.isModalOpen", false); // Close modal on success

                // Clear the input fields after successful save
                component.set("v.contactId", '');
                component.set("v.accountId", '');
                component.set("v.opportunityId", '');

                // AUTO REFRESH: Call helper to reload the connections list
                helper.loadConnections(component);

            } else if (state === "ERROR") {
                var errors = response.getError();
                var errorMessage = 'Unknown error';
                if (errors && errors[0] && errors[0].message) {
                    errorMessage = errors[0].message;
                    // Handle AuraHandledException message from Apex
                    if (errorMessage.includes('All fields are required.')) {
                        errorMessage = 'Server-side validation failed: All fields are required.';
                    } else if (errorMessage.includes('No existing Connection__c record found')) {
                        // This specific error might not be thrown as a direct user error, but more for debug
                        // Adjust as per your Apex error handling
                    }
                }
                console.error("Error saving connection: ", errorMessage);
                helper.showToast('Error', errorMessage, 'error');
            }
        });
        $A.enqueueAction(action);
    }
})