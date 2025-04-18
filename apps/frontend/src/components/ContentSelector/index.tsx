import { useMemo } from "react";

const ContentSelector = (props: { menu: string }) => {
    const { menu } = props;

    const contentRenderer = useMemo(() => {
        switch (menu) {
            case 'campaign_list':
                return 'Campaign List';
            case 'create_email_campaign':
                return 'Create Campaign';
            case 'audience_list':
                return 'Audience List';
            case 'create_audience':
                return 'Create Audience';
            default:
                return null;
        }
    }, [menu]);
    
    return (
        <>
        {contentRenderer}
        </>
    )
}

export default ContentSelector;