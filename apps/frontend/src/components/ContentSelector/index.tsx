import { useMemo } from "react";
import CreateCampaign from "../CampaignCreation";
import CampaignListsPage from "../CampaignLists";
import AudienceEmailListsPage from "../AudienceLists";
import CreateAudienceMember from "../AudienceCreation";
import AutomationListsPage from "../AutomationLists";
import AutomationCreation from "../AutomationCreation";
import Dashboard from "../Dashboard";

const ContentSelector = (props: { menu: string }) => {
    const { menu } = props;

    const contentRenderer = useMemo(() => {
        switch (menu) {
            case 'dashboard':
                return <Dashboard />;
            case 'campaign_list':
                return <CampaignListsPage />;
            case 'create_email_campaign':
                return <CreateCampaign />;
            case 'audience_list':
                return <AudienceEmailListsPage />;
            case 'create_audience':
                return <CreateAudienceMember />;
            case 'automation_list':
                return <AutomationListsPage />;
            case 'create_automation':
                return <AutomationCreation />;
            default:
                return <Dashboard />;
        }
    }, [menu]);
    
    return (
        <>
        {contentRenderer}
        </>
    )
}

export default ContentSelector;