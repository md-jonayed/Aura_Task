public with sharing class ConnectionManager {

    @AuraEnabled
    public static Contact getContactWithAccount(Id contactId) {
        // Always check for null IDs before SOQL queries to prevent errors
        if (contactId == null) {
            throw new AuraHandledException('Contact ID cannot be null.');
        }
        return [
            SELECT Id, AccountId
            FROM Contact
            WHERE Id = :contactId
            LIMIT 1
        ];
    }

    @AuraEnabled
    public static Id saveConnectionApex(Id contactId, Id accountId, Id opportunityId) {
        system.debug('hello');
        system.debug('ContactId: ' + contactId);
        system.debug('AccountId: ' + accountId);
        system.debug('OpportunityId: ' + opportunityId);

        // Corrected if statement syntax
        if (contactId == null || accountId == null || opportunityId == null) {
            throw new AuraHandledException('All fields (Contact, Account, Opportunity) are required.');
        }

        // Initialize connection to null.
        // It's good practice to wrap SOQL queries that might return no rows in a try-catch block
        // or check if the list is empty if you're querying into a list.
        // Here, since we are limiting to 1, we can query directly into a single sObject.
        Connection__c connection = null;
        try {
            connection = [
                SELECT Id, Contact__c, Account__c, Opportunity__c // Include Opportunity__c in the select if you plan to update it
                FROM Connection__c
                WHERE Contact__c = :contactId // Correct binding variable
                LIMIT 1
            ];
        } catch (QueryException e) {
            // No existing connection found for this contact, proceed to insert
            System.debug('No existing Connection__c record found for Contact ID: ' + contactId);
        }

        if (connection != null) { // Corrected if condition to check if connection was found
            connection.Account__c = accountId;
            connection.Opportunity__c = opportunityId; // Corrected typo from conection to connection
            update connection;
            return connection.Id; // Return the ID of the updated record
        } else {
            // If no existing connection, create a new one
            Connection__c conn = new Connection__c(
                Contact__c = contactId,
                Account__c = accountId,
                Opportunity__c = opportunityId
            );
            system.debug(conn);
            insert conn;
            return conn.Id;
        }
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, List<Map<String, String>>> fetchPicklistData() {
        List<Map<String, String>> contactOptions = new List<Map<String, String>>();
        List<Map<String, String>> accountOptions = new List<Map<String, String>>();
        List<Map<String, String>> opportunityOptions = new List<Map<String, String>>();

        for (Contact c : [SELECT Id, Name FROM Contact ORDER BY Name]) { // Added ORDER BY Name for better UX
            contactOptions.add(new Map<String, String>{'value' => c.Id, 'label' => c.Name});
        }

        for (Account a : [SELECT Id, Name FROM Account ORDER BY Name]) { // Added ORDER BY Name
            accountOptions.add(new Map<String, String>{'value' => a.Id, 'label' => a.Name});
        }

        for (Opportunity o : [SELECT Id, Name FROM Opportunity ORDER BY Name]) { // Added ORDER BY Name
            opportunityOptions.add(new Map<String, String>{'value' => o.Id, 'label' => o.Name});
        }

        return new Map<String, List<Map<String, String>>>{
            'contacts' => contactOptions,
            'accounts' => accountOptions,
            'opportunities' => opportunityOptions
        };
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> fetchConnections() {
        List<Map<String, String>> connectionsList = new List<Map<String, String>>();

        // Use a null check on the related records to prevent NullPointerExceptions
        for (Connection__c conn : [
            SELECT Id,
                   Contact__r.Name,
                   Account__r.Name,
                   Opportunity__r.Name
            FROM Connection__c
            ORDER BY lastmodifieddate DESC // Added ORDER BY for better presentation
        ]) {
            connectionsList.add(new Map<String, String>{
                'ContactName' => conn.Contact__r != null ? conn.Contact__r.Name : '',
                'AccountName' => conn.Account__r != null ? conn.Account__r.Name : '',
                'OpportunityName' => conn.Opportunity__r != null ? conn.Opportunity__r.Name : ''
            });
        }

        return connectionsList;
    }
}