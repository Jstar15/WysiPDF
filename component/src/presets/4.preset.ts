// src/app/presets/invoice.preset.ts
import { Page } from '../models/interfaces';

export const Preset4: Page = {
  "header": {
    "rows": [
      {
        "height": 50,
        "widths": [
          70,
          30
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p><span style=\"color:#b45309;font-size:16px;\">Field Trip Permission &amp; Safety</span></p><p><span style=\"color:#94a3b8;font-size:10px;\">Please complete and return to homeroom teacher</span></p>",
            "attrs": {
              "paddingTop": 8,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 2,
              "borderLeft": 0,
              "borderColor": "#f59e0b",
              "backgroundColor": "transparent"
            }
          },
          {
            "type": "image",
            "value": "",
            "imageBlock": {
              "imageBase64": "data:image/png;base64,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",
              "filename": "download.png",
              "width": 30,
              "alignment": "right"
            },
            "attrs": {
              "paddingTop": 6,
              "paddingRight": 8,
              "paddingBottom": 6,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 2,
              "borderLeft": 0,
              "borderColor": "#f59e0b",
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
            "value": "<p><strong style=\"font-size:15px;color:#b45309;\">Trip Overview</strong></p>",
            "attrs": {
              "paddingTop": 12,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#fde68a",
              "backgroundColor": "#fffbeb"
            }
          }
        ],
        "backgroundColor": "#fffbeb"
      },
      {
        "height": 0,
        "widths": [
          40,
          30,
          30
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:10px;color:#475569;\">Destination</p><p style=\"font-size:14px;\"><strong>City Science Museum</strong></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 10,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#fcd34d"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:10px;color:#475569;\">Date</p><p style=\"font-size:14px;\">22 Nov 2025</p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 10,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#fcd34d"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:10px;color:#475569;\">Depart / Return</p><p style=\"font-size:14px;\">08:45 → 15:30</p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 10,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#fcd34d"
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
            "value": "<p><strong style=\"font-size:15px;color:#b45309;\">Student Details</strong></p>",
            "attrs": {
              "paddingTop": 12,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#fde68a",
              "backgroundColor": "#fffbeb"
            }
          }
        ],
        "backgroundColor": "#fffbeb"
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
            "value": "<p style=\"font-size:10px;color:#475569;\">Student Name</p><p style=\"font-size:14px;\"><strong>Maya Thompson</strong></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 10,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:10px;color:#475569;\">Class / Teacher</p><p style=\"font-size:14px;\">Year 6 — Ms. Alvarez</p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 10,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:10px;color:#475569;\">Emergency Contact</p><p style=\"font-size:14px;\">E. Thompson · (555) 201-8899</p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 10,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1"
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
            "value": "<p><strong style=\"font-size:15px;color:#b45309;\">Medical & Dietary</strong></p>",
            "attrs": {
              "paddingTop": 12,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#fde68a",
              "backgroundColor": "#fffbeb"
            }
          }
        ],
        "backgroundColor": "#fffbeb"
      },
      {
        "height": 0,
        "widths": [
          40,
          30,
          30
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#b45309;\"><strong>Allergies</strong></p><ul style=\"font-size:13px;line-height:1.5;color:#334155;\"><li>Peanuts — carries EpiPen</li><li>Seasonal pollen</li></ul>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 12,
              "paddingLeft": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#fcd34d",
              "backgroundColor": "white"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#b45309;\"><strong>Medications</strong></p><ul style=\"font-size:13px;line-height:1.5;color:#334155;\"><li>Salbutamol inhaler PRN</li><li>EpiPen as directed</li></ul>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 12,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#fcd34d",
              "backgroundColor": "white"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#b45309;\"><strong>Dietary Needs</strong></p><ul style=\"font-size:13px;line-height:1.5;color:#334155;\"><li>Vegetarian lunch</li><li>No sesame products</li></ul>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 12,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#fcd34d",
              "backgroundColor": "white"
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
            "value": "<p><strong style=\"font-size:15px;color:#b45309;\">Packing Checklist</strong></p>",
            "attrs": {
              "paddingTop": 12,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#fde68a",
              "backgroundColor": "#fffbeb"
            }
          }
        ],
        "backgroundColor": "#fffbeb"
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
            "value": "<ul style=\"font-size:13px;line-height:1.6;color:#334155;\"><li>□ Packed lunch & water bottle</li><li>□ Comfortable walking shoes</li><li>□ Weather-appropriate jacket</li><li>□ Personal medication (labelled)</li></ul>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 12,
              "paddingLeft": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1",
              "backgroundColor": "white"
            }
          },
          {
            "type": "html",
            "value": "<ul style=\"font-size:13px;line-height:1.6;color:#334155;\"><li>□ Sunscreen (apply before school)</li><li>□ Hat with brim</li><li>□ Small backpack</li><li>□ Pocket money (optional, max $10)</li></ul>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 12,
              "paddingBottom": 12,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1",
              "backgroundColor": "white"
            }
          }
        ],
        "backgroundColor": "white"
      },
      {
        "type": "page-break",
        "height": 0,
        "widths": [
          100
        ],
        "cells": [],
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
            "value": "<p><strong style=\"font-size:15px;color:#b45309;\">Schedule & Conduct</strong></p>",
            "attrs": {
              "paddingTop": 12,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#fde68a",
              "backgroundColor": "#fffbeb"
            }
          }
        ],
        "backgroundColor": "#fffbeb"
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
            "value": "<p style=\"font-size:12px;color:#b45309;\"><strong>Timeline</strong></p><ol style=\"font-size:13px;line-height:1.6;color:#334155;\"><li>08:45 — Board bus from North Gate</li><li>10:00 — Guided exhibits tour</li><li>12:00 — Lunch at museum courtyard</li><li>13:00 — Workshop: Renewable Energy</li><li>14:30 — Depart museum</li></ol>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 12,
              "paddingLeft": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#fcd34d",
              "backgroundColor": "white"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#b45309;\"><strong>Conduct & Safety</strong></p><ul style=\"font-size:13px;line-height:1.6;color:#334155;\"><li>□ Stay with assigned group</li><li>□ Follow staff instructions</li><li>□ No food/drink in exhibit halls</li><li>□ Report any issue to a teacher immediately</li></ul>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 12,
              "paddingBottom": 12,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#fcd34d",
              "backgroundColor": "white"
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
            "value": "<p><strong style=\"font-size:15px;color:#b45309;\">Permissions</strong></p>",
            "attrs": {
              "paddingTop": 12,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#fde68a",
              "backgroundColor": "#fffbeb"
            }
          }
        ],
        "backgroundColor": "#fffbeb"
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
            "value": "<ul style=\"font-size:13px;line-height:1.6;color:#334155;\"><li>□ I give permission for my child to attend the trip.</li><li>□ I consent to first aid/medical treatment if required.</li><li>□ Photo consent: □ Yes  □ No</li></ul>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 12,
              "paddingLeft": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1",
              "backgroundColor": "white"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right\" style=\"font-size:12px;color:#334155;\">Parent/Guardian Signature: ______________________</p><p class=\"ql-align-right\" style=\"font-size:12px;color:#334155;\">Name & Date: ________________________________</p><p class=\"ql-align-right\" style=\"font-size:12px;color:#334155;\">Teacher Signature: ____________________________</p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 12,
              "paddingBottom": 12,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1",
              "backgroundColor": "white"
            }
          }
        ],
        "backgroundColor": "white"
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
            "value": "<p class=\"ql-align-center\"><span style=\"font-size:11px;color:#64748b;\">School policy applies at all times during excursions. Bus provider: City Coaches · (555) 000-4411</span></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 10,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 0,
              "borderBottom": 0,
              "borderLeft": 0,
              "borderColor": "#e2e8f0",
              "backgroundColor": "transparent"
            }
          }
        ],
        "backgroundColor": "white"
      }
    ]
  },
  "pageAttrs": {
    "marginTop": 24,
    "marginRight": 24,
    "marginLeft": 24,
    "marginBottom": 24,
    "headerMargin": 16,
    "footerMargin": 16,
    "backgroundColor": "white",
    "defaultFont": "Roboto"
  },
  "tokenAttrs": [],
  "partialContent": []
};
