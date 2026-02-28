import React from 'react';

export default function SatelliteAgricultureContent() {
  return (
    <div className="single">
      <div className="container">
        <div className="row">
          <div className="col-lg-2"></div>
          <div className="col-lg-8">
            <div className="single-content">
              {/* Satellite Monitoring Section */}
              <img src="/images/services/satellite-agriculture.jpg" alt="Satellite Monitoring" className="rounded-3xl mb-8 shadow-lg" />
              <h3>Satellite-Based Earth Agriculture Monitoring</h3>
              <p className="mb-6">
                Planet Labs' satellite constellation provides high-frequency, daily imaging to track crop health,
                detect pests, and measure soil moisture accurately across vast agricultural landscapes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-12">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h4 className="text-xl font-bold mb-3 text-tutia">Data Usage & Analytics</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Empowering farmers with actionable data to make informed decisions on fertilizer use,
                    irrigation efficiency, and optimal harvest timing for maximum yield.
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <h4 className="text-xl font-bold mb-3 text-tutia">Sustainability & Impact</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Satellite data aids in monitoring environmental impacts, such as carbon sequestration,
                    and supports sustainable farming practices for a greener future.
                  </p>
                </div>
              </div>

              <img src="/images/services/satellite-agriculture-app.jpeg" alt="Agricultural Data App" className="rounded-3xl my-8 shadow-lg" />

              <p>
                Our advanced satellite solutions bridge the gap between space technology and ground-level farming.
                By providing a constant eye in the sky, we help agricultural enterprises transition into
                precision agriculture, ensuring food security and environmental conservation simultaneously.
                <br /><br />
                We provide the tools needed to monitor every acre, every day, enabling a level of insight
                previously impossible. From detecting early signs of crop stress to optimizing resource
                distribution, our satellite-based services are at the forefront of the agricultural revolution.
              </p>
            </div>
          </div>
          <div className="col-lg-2"></div>
        </div>
      </div>
    </div>
  );
}
