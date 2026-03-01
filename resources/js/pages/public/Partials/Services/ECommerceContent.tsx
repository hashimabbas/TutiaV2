import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export default function ECommerceContent() {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    return (
        // <!-- Single Post Start-->
        <div className="single" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="container">
                <div className="row">
                    <div className="col-lg-2"></div>
                    <div className="col-lg-8">
                        <div className={cn(
                            "single-content",
                            isRtl ? "text-right" : "text-left"
                        )}>
                            <img src="images/services/online-shop-g7a91d4a91_640.png" alt={t("E-commerce Image")} />
                            <h3 className="font-oswald">{t("E-commerce")}</h3>
                            <div className="text-gray-600 dark:text-gray-400">
                                <p className="font-bold text-tutia">
                                    {t("ECommerce Welcome")}
                                </p>
                                <p>
                                    {t("ECommerce Description")}
                                </p>
                                <p>
                                    {t("ECommerce Detail 1")}
                                    <br /><br />
                                    {t("ECommerce Detail 2")}
                                    <a href="https://www.Matger-tutia.sd" target="_blank" className="text-primary hover:underline">
                                        www.Matger-tutia.sd
                                    </a>
                                    <br /><br />
                                    {t("ECommerce Detail 3")}
                                    <br /><br />
                                    {t("ECommerce Detail 4")}
                                    <br /><br />
                                    {t("Website")} <a href="https://matger-tutia.com/" target="_blank" className="text-primary hover:underline">Matger-TUTIA</a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-2"></div>
                </div>
            </div>
        </div>
        // <!-- Single Post End-->
    );
}
