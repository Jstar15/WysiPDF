// src/app/presets/invoice.preset.ts
import { Page } from '../models/interfaces';

export const Preset1: Page = {
  "header": {
    "rows": [
      {
        "height": 50,
        "widths": [
          50,
          50
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p><span style=\"color: rgb(0, 102, 204); font-size: 16px;\">Imaging Request &amp; Screening</span></p><p><span style=\"color: rgb(187, 187, 187); font-size: 10px;\">Complete clearly. Use block capitals where possible.</span></p>",
            "attrs": {
              "paddingTop": 5,
              "paddingRight": 5,
              "paddingBottom": 5,
              "paddingLeft": 5,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 0,
              "borderLeft": 0,
              "borderColor": "white",
              "backgroundColor": "transparent"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right\"><span style=\"color: rgb(187, 187, 187);\">Facility</span><strong style=\"font-size: 24px;\">Riverside </strong></p>",
            "attrs": {
              "paddingTop": 5,
              "paddingRight": 5,
              "paddingBottom": 5,
              "paddingLeft": 5,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 0,
              "borderLeft": 0,
              "borderColor": "white",
              "backgroundColor": "transparent"
            }
          }
        ],
        "backgroundColor": "white"
      }
    ]
  },
  "content": {
    "rows": [
      {
        "height": 0,
        "widths": [
          100
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p><strong class=\"ql-font-roboto\" style=\"font-size:15px;color:#0b6e99;\">Patient Information</strong></p>",
            "attrs": {
              "paddingTop": 14,
              "paddingBottom": 8,
              "borderBottom": 1,
              "borderColor": "#e2e8f0",
              "backgroundColor": "#f1f5f9"
            }
          }
        ],
        "backgroundColor": "transparent"
      },
      {
        "height": 0,
        "widths": [
          33.33,
          33.33,
          33.34
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:14px;\"><span style=\"font-size: 10px;\">Full Name</span></p><p style=\"font-size:14px;\"><strong style=\"font-size: 14px;\">Jane Citizen</strong></p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#475569;\"><span style=\"font-size: 10px;\">Date of Birth</span></p><p style=\"font-size:14px;\">01 Feb 1985</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#475569;\"><span style=\"font-size: 10px;\">MRN</span></p><p style=\"font-size:14px;\">A-102938</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1"
            }
          }
        ],
        "backgroundColor": ""
      },
      {
        "height": 0,
        "widths": [
          50,
          50
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#475569;\"><span style=\"font-size: 10px;\">Phone</span></p><p style=\"font-size:14px;\">(000) 555-7890</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#475569;\"><span style=\"font-size: 10px;\">Email</span></p><p style=\"font-size:14px;\">jane@example.com</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1"
            }
          }
        ]
      },
      {
        "height": 0,
        "widths": [
          100
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#475569;\"><span style=\"font-size: 10px;\">Address</span></p><p style=\"font-size:14px;\">123 Harbor Rd, City</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1"
            }
          }
        ]
      },
      {
        "height": 0,
        "widths": [
          100
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p><strong class=\"ql-font-roboto\" style=\"font-size:15px;color:#0b6e99;\">Insurance &amp; Referrer</strong></p>",
            "attrs": {
              "paddingTop": 14,
              "paddingBottom": 8,
              "borderBottom": 1,
              "borderColor": "#e2e8f0",
              "backgroundColor": "#f1f5f9"
            }
          }
        ]
      },
      {
        "height": 0,
        "widths": [
          50,
          50
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#475569;\"><span style=\"font-size: 10px;\">Insurance Provider</span></p><p style=\"font-size:14px;\">Blue Shield</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#475569;\"><span style=\"font-size: 10px;\">Policy Number</span></p><p style=\"font-size:14px;\">POL-998877</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1"
            }
          }
        ]
      },
      {
        "height": 0,
        "widths": [
          100
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#475569;\">Referring Doctor</p><p style=\"font-size:14px;\">Dr. Michael Chan</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1"
            }
          }
        ]
      },
      {
        "height": 0,
        "widths": [
          100
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p><strong class=\"ql-font-roboto\" style=\"font-size:15px;color:#0b6e99;\">Study Details</strong></p>",
            "attrs": {
              "paddingTop": 14,
              "paddingBottom": 8,
              "borderBottom": 1,
              "borderColor": "#e2e8f0",
              "backgroundColor": "#f1f5f9"
            }
          }
        ]
      },
      {
        "height": 0,
        "widths": [
          33.33,
          33.33,
          33.34
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#475569;\"><span style=\"font-size: 10px;\">Modality</span></p><p style=\"font-size:14px;\">MRI</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#475569;\"><span style=\"font-size: 10px;\">Body Part</span></p><p style=\"font-size:14px;\">Brain</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#475569;\"><span style=\"font-size: 10px;\">Priority</span></p><p style=\"font-size:14px;\">□ Routine □ Urgent □ STAT</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1"
            }
          }
        ]
      },
      {
        "height": 0,
        "widths": [
          100
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#475569;\"><span style=\"font-size: 10px;\">Clinical Indication</span></p><p style=\"font-size:14px;\">Headache, rule out mass</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1"
            }
          }
        ]
      },
      {
        "type": "page-break",
        "height": 0,
        "widths": [
          100
        ],
        "cells": []
      },
      {
        "height": 50,
        "widths": [
          100
        ],
        "cells": [
          {
            "type": "html",
            "value": "",
            "attrs": {
              "paddingTop": 5,
              "paddingRight": 5,
              "paddingBottom": 5,
              "paddingLeft": 5,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 0,
              "borderLeft": 0,
              "borderColor": "white",
              "backgroundColor": "transparent"
            }
          }
        ],
        "backgroundColor": "white"
      },
      {
        "height": 50,
        "widths": [
          100
        ],
        "cells": [
          {
            "type": "html",
            "value": "",
            "attrs": {
              "paddingTop": 5,
              "paddingRight": 5,
              "paddingBottom": 5,
              "paddingLeft": 5,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 0,
              "borderLeft": 0,
              "borderColor": "white",
              "backgroundColor": "transparent"
            }
          }
        ],
        "backgroundColor": "white"
      },
      {
        "height": 0,
        "widths": [
          100
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p><strong class=\"ql-font-roboto\" style=\"font-size:15px;color:#0b6e99;\">Safety Screening</strong></p>",
            "attrs": {
              "paddingTop": 14,
              "paddingBottom": 8,
              "borderBottom": 1,
              "borderColor": "#e2e8f0",
              "backgroundColor": "#f1f5f9"
            }
          }
        ]
      },
      {
        "height": 0,
        "widths": [
          50,
          50
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:14px;\">• Pacemake r/ICD </p><p style=\"font-size:14px;\">• Cochlear implant </p><p style=\"font-size:14px;\">• Aneurysm clips </p><p style=\"font-size:14px;\">• Severe claustrophobia</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:14px;\">• Metal in eye </p><p style=\"font-size:14px;\">• Recent surgery (&lt;6 weeks) </p><p style=\"font-size:14px;\">• Allergy to iodine/ contrast </p><p style=\"font-size:14px;\">• Asthma • Diabetes (Meformin)</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1"
            }
          }
        ]
      },
      {
        "height": 0,
        "widths": [
          100
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p><strong class=\"ql-font-roboto\" style=\"font-size:15px;color:#0b6e99;\">Preparation &amp; Appointment</strong></p>",
            "attrs": {
              "paddingTop": 14,
              "paddingBottom": 8,
              "borderBottom": 1,
              "borderColor": "#e2e8f0",
              "backgroundColor": "#f1f5f9"
            }
          }
        ]
      },
      {
        "height": 0,
        "widths": [
          60,
          40
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:13px;color:#334155;\">Arrive 10 minutes early. Bring referral, Medicare/insurance card, and prior imaging (if any). If fasting is required, do not eat for 6 hours before your appointment. You may drink water.</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#bae6fd",
              "backgroundColor": "#ecfeff"
            }
          },
          {
            "type": "html",
            "value": "<p><span style=\"font-size:12px;color:#475569;\">Preferred Date</span><br><span style=\"font-size:14px;\">15 Oct 2025</span></p><p><span style=\"font-size:12px;color:#475569;\">Preferred Time</span><br><span style=\"font-size:14px;\">10:30</span></p><p><span style=\"font-size:12px;color:#475569;\">Fasting</span><br><span style=\"font-size:14px;\">Yes</span></p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#bae6fd"
            }
          }
        ]
      },
      {
        "height": 0,
        "widths": [
          100
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p><strong class=\"ql-font-roboto\" style=\"font-size:15px;color:#0b6e99;\">Consent &amp; Signatures</strong></p>",
            "attrs": {
              "paddingTop": 14,
              "paddingBottom": 8,
              "borderBottom": 1,
              "borderColor": "#e2e8f0",
              "backgroundColor": "#f1f5f9"
            }
          }
        ]
      },
      {
        "height": 0,
        "widths": [
          60,
          40
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#334155;\">I confirm the information provided is accurate to the best of my knowledge. I understand the benefits and risks of the requested imaging, including the use of contrast if indicated, and consent to proceed.</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right\"><span style=\"font-size:12px;color:#334155;\">Patient/Guardian Signature:&nbsp;__________________________</span></p><p class=\"ql-align-right\"><span style=\"font-size:12px;color:#334155;\">Date:&nbsp;____/____/________</span></p><p class=\"ql-align-right\"><span style=\"font-size:12px;color:#334155;\">Clinician Signature:&nbsp;__________________________</span></p>",
            "attrs": {
              "paddingTop": 12,
              "paddingBottom": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1"
            }
          }
        ]
      }
    ]
  },
  "footer": {
    "rows": [
      {
        "height": 0,
        "widths": [
          100
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p><span style=\"font-size:11px;color:#64748b;\">Confidential — for clinical use only. If received in error, please contact the facility and destroy this form.</span></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingBottom": 10,
              "borderTop": 1,
              "borderColor": "#e2e8f0"
            }
          }
        ]
      }
    ]
  },
  "pageAttrs": {
    "marginTop": 24,
    "marginRight": 24,
    "marginLeft": 24,
    "marginBottom": 24,
    "headerMarginTop": 30,
    "headerMarginRight":18,
    "headerMarginLeft": 18,
    "headerMarginBottom": 5,
    "headerHeight": 40,
    "footerMarginTop": 5,
    "footerMarginRight": 30,
    "footerMarginLeft": 30,
    "footerMarginBottom": 5,
    "footerHeight": 50,
    "backgroundColor": "white",
    "defaultFont": "Roboto"
  },
  "tokenAttrs": [],
  "partialContent": [],
  "colorPalettes": [
    '#000000', '#111827', '#1F2937', '#374151', '#4B5563',
    '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#FFFFFF',
    '#1D4ED8', '#2563EB', '#3B82F6', '#6366F1', '#818CF8',
    '#0E7490', '#06B6D4', '#22D3EE', '#67E8F9',
    '#065F46', '#10B981', '#34D399', '#86EFAC',
    '#B45309', '#F59E0B', '#FBBF24', '#FB923C',
    '#B91C1C', '#EF4444', '#F87171', '#FCA5A5',
    '#BE185D', '#EC4899', '#F472B6', '#8B5CF6', '#A78BFA', '#DDD6FE'
  ]
};
