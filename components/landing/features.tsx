export function Features() {
    return (
      <section className="py-32 bg-[#F5F5F5]">
        <div className="container mx-auto px-4">
          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Bulk Editing */}
            <div className="bg-white p-8 rounded-2xl">
              <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-[#CEFE01]">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Bulk Content Editing</h3>
              <p className="text-gray-600">
                Edit multiple entries simultaneously. Save hours of manual work with our powerful bulk operations.
              </p>
            </div>
  
            {/* Smart Search */}
            <div className="bg-white p-8 rounded-2xl">
              <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-[#CEFE01]">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Search</h3>
              <p className="text-gray-600">
                Find content instantly across all your spaces with our advanced search capabilities.
              </p>
            </div>
  
            {/* Real-time Preview */}
            <div className="bg-white p-8 rounded-2xl">
              <div className="mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-[#CEFE01]">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Preview</h3>
              <p className="text-gray-600">
                See changes instantly with our live preview feature. No more guessing what your content will look like.
              </p>
            </div>
          </div>
  
          {/* App Preview */}
          <div className="mt-24">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Replace this with your actual app screenshot */}
              <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">App Screenshot</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }