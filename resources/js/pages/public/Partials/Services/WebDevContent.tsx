import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export default function WebDevContent() {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'ar';

    return (
        // <!-- Single Post Start-->
        <div className="single" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="container">
                <div className="row">
                    {/* Empty column for spacing */}
                    <div className="col-lg-2"></div>
                    <div className="col-lg-8">
                        <div className={cn(
                            "single-content",
                            isRtl ? "text-right" : "text-left"
                        )}>
                            <img src="images/services/web-design.jpg" alt={t("Web Development Image")} />
                            <h3 className="font-oswald">{t("Web Development")}</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t("Web Dev Content 1")}
                                <br />
                                <br />
                                {t("Web Dev Content 2")}
                            </p>

                        </div>
                    </div>
                    {/* Empty column for spacing */}
                    <div className="col-lg-2"></div>
                </div>
            </div>
        </div>
        // <!-- Single Post End-->
    );
}
