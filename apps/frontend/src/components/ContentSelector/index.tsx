import { useMemo } from "react";
import CreateCampaign from "../CampaignCreation";
import CampaignListsPage from "../CampaignLists";

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
                return 'Audience List';
            case 'create_audience':
                return 'Create Audience';
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