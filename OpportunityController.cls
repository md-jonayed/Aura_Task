public with sharing class OpportunityController {
    @AuraEnabled(cacheable=true)
    public static List<Opportunity> getOpportunities() {
        return [
            SELECT Id, Type, Name, StageName
            FROM Opportunity
            LIMIT 50
        ];
    }
}