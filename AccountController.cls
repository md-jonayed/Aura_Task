public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts() {
        return [
            SELECT Id, Name, Top_Account__c, Industry
            FROM Account
            LIMIT 50
        ];
    }
}