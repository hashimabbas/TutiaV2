import React from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export default function SatelliteAgricultureContent() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';

  return (
    <div className="single" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container">
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8">
            <div className={cn(
              "single-content",
              isRtl ? "text-right" : "text-left"
            )}>
              {/* Satellite Monitoring Section */}
              <img src="/images/services/satellite-agriculture.jpg" alt={t("Satellite Monitoring")} className="rounded-3xl mb-8 shadow-lg" />
              <h3 className="font-oswald">{t("Satellite Monitoring Title")}</h3>
              <p className="mb-6 text-gray-600 dark:text-gray-400">
                {t("Satellite Monitoring Text")}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h4 className={cn(
                    "text-xl font-bold mb-3 text-tutia font-oswald",
                    isRtl ? "text-right" : "text-left"
                  )}>
                    {t("Data Usage Analytics")}
                  </h4>
                  <p className={cn(
                    "text-sm text-gray-600 dark:text-gray-400",
                    isRtl ? "text-right" : "text-left"
                  )}>
                    {t("Data Usage Analytics Text")}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h4 className={cn(
                    "text-xl font-bold mb-3 text-tutia font-oswald",
                    isRtl ? "text-right" : "text-left"
                  )}>
                    {t("Sustainability Impact")}
                  </h4>
                  <p className={cn(
                    "text-sm text-gray-600 dark:text-gray-400",
                    isRtl ? "text-right" : "text-left"
                  )}>
                    {t("Sustainability Impact Text")}
                  </p>
                </div>
              </div>

              <img src="/images/services/satellite-agriculture-app.jpeg" alt={t("Agricultural Data App")} className="rounded-3xl my-8 shadow-lg" />

              <p className="text-gray-600 dark:text-gray-400">
                {t("Satellite Solution Text 1")}
                <br /><br />
                {t("Satellite Solution Text 2")}
              </p>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    </div>
  );
}
