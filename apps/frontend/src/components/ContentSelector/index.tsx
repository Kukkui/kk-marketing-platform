import { useMemo } from "react";
import CreateCampaign from "../CampaignCreation";
import CampaignListsPage from "../CampaignLists";
import AudienceEmailListsPage from "../AudienceLists";
import CreateAudienceMember from "../AudienceCreation";
import AutomationForm from "../AutomationCreation";
import AutomationListsPage from "../AutomationLists";
import AutomationCreation from "../AutomationCreation";

const ContentSelector = (props: { menu: string }) => {
    const { menu } = props;

    const contentRenderer = useMemo(() => {
        switch (menu) {
            case 'campaign_list':
                // return 'Campaign List';
                return <CampaignListsPage />;
            case 'create_email_campaign':
                // return 'Create Campaign';
                return <CreateCampaign />;
            case 'audience_list':
                // return 'Audience List';
                return <AudienceEmailListsPage />;
            case 'create_audience':
                // return 'Create Audience';
                return <CreateAudienceMember />;
            case 'automation_list':
                // return 'Automation List';
                return <AutomationListsPage />;
            case 'create_automation':
                // return 'Create Automation';
                return <AutomationCreation />;
            default:
                return 'PLEASE SELECT A MENU';
        }
    }, [menu]);
    
    return (
        <>
        {contentRenderer}
        </>
    )
}

export default ContentSelector;