// src/app/presets/invoice.preset.ts
import { Page } from '../models/page';

export const Preset3: Page = {
  "header": {
    "rows": [
      {
        "height": 50,
        "widths": [
          60,
          40
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p><span style=\"color:#0d9488;font-size:16px;\">Diabetes Care Plan</span></p>",
            "attrs": {
              "paddingTop": 8,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 2,
              "borderLeft": 0,
              "borderColor": "#0d9488",
              "backgroundColor": "transparent"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right\"><span style=\"font-size:12px;color:#0f766e;\">Seaside Family Clinic</span></p><p class=\"ql-align-right\"><span style=\"font-size:10px;color:#64748b;\">(555) 123-4567 · care@seaside.example</span></p>",
            "attrs": {
              "paddingTop": 8,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 2,
              "borderLeft": 0,
              "borderColor": "#0d9488",
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
            "value": "<p><strong class=\"ql-font-roboto\" style=\"font-size:15px;color:#0d9488;\">Patient & Visit</strong></p>",
            "attrs": {
              "paddingTop": 12,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#e2e8f0",
              "backgroundColor": "#f0fdfa"
            }
          }
        ],
        "backgroundColor": "#f0fdfa"
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
            "value": "<p style=\"font-size:10px;color:#475569;\"><span style=\"font-size: 10px; color: rgb(68, 68, 68);\">Full Name</span></p><p style=\"font-size:14px;\"><strong>Jordan Ellis</strong></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 10,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1",
              "backgroundColor": "transparent"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:10px;color:#475569;\"><span style=\"font-size: 10px; color: rgb(68, 68, 68);\">Date of Birth</span></p><p style=\"font-size:14px;\">02 May 1974</p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 10,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1",
              "backgroundColor": "transparent"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:10px;color:#475569;\"><span style=\"font-size: 10px; color: rgb(68, 68, 68);\">Record No.</span></p><p style=\"font-size:14px;\">MRN-449210</p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 10,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1",
              "backgroundColor": "transparent"
            }
          }
        ],
        "backgroundColor": "white"
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
            "value": "<p style=\"font-size:10px;color:#475569;\"><span style=\"color: rgb(68, 68, 68); font-size: 10px;\">Visit Date</span></p><p style=\"font-size:14px;\">18 Aug 2025</p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 10,
              "paddingLeft": 10,
              "borderTop": 0,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#cbd5e1",
              "backgroundColor": "transparent"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:10px;color:#475569;\"><span style=\"font-size: 10px; color: rgb(68, 68, 68);\">Clinician</span></p><p style=\"font-size:14px;\">Dr. N. Patel</p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 10,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1",
              "backgroundColor": "transparent"
            }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:10px;color:#475569;\"><span style=\"color: rgb(68, 68, 68); font-size: 10px;\">Location</span></p><p style=\"font-size:14px;\">Room 3B · Seaside</p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 10,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#cbd5e1",
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
            "value": "<p><strong class=\"ql-font-roboto\" style=\"font-size:15px;color:#0d9488;\">Clinical Snapshot</strong></p>",
            "attrs": {
              "paddingTop": 14,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#e2e8f0",
              "backgroundColor": "#f0fdfa"
            }
          }
        ],
        "backgroundColor": "#f0fdfa"
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
            "value": "<p class=\"ql-align-center\" style=\"font-size:10px;color:#0f766e;\"><span style=\"font-size: 10px;\">HbA1c</span></p><p class=\"ql-align-center\" style=\"font-size:22px;color:#0d9488;\"><strong style=\"color: rgb(0, 138, 0);\">7.8%</strong></p><p class=\"ql-align-center\" style=\"font-size:11px;color:#64748b;\"><span style=\"font-size: 10px;\">(target &lt; 7.0%)</span></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 10,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#99f6e4",
              "backgroundColor": "#ecfeff"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-center\" style=\"font-size:10px;color:#0f766e;\"><span style=\"font-size: 10px;\">Blood Pressure</span></p><p class=\"ql-align-center\" style=\"font-size:22px;color:#0d9488;\"><strong style=\"color: rgb(0, 138, 0);\">132/82</strong></p><p class=\"ql-align-center\" style=\"font-size:11px;color:#64748b;\"><span style=\"font-size: 10px;\">(mmHg)</span></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 10,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#99f6e4",
              "backgroundColor": "#ecfeff"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-center\" style=\"font-size:10px;color:#0f766e;\"><span style=\"font-size: 10px;\">BMI</span></p><p class=\"ql-align-center\" style=\"font-size:22px;color:#0d9488;\"><strong style=\"color: rgb(0, 138, 0);\">28.6</strong></p><p class=\"ql-align-center\" style=\"font-size:11px;color:#64748b;\"><span style=\"font-size: 10px;\">kg/m²</span></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 10,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#99f6e4",
              "backgroundColor": "#ecfeff"
            }
          }
        ],
        "backgroundColor": "white"
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
            "value": "<p style=\"font-size:12px;color:#0d9488;\"><strong>Active Problems</strong></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Type 2 diabetes melltus</li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Hypertension </li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Dyslipidaemia </li></ol>",
            "attrs": {
              "paddingTop": 12,
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
            "value": "<p style=\"font-size:12px;color:#0d9488;\"><strong>Allergies</strong></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Penicillin — rash </li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>Statin-associated myalgia</li></ol>",
            "attrs": {
              "paddingTop": 12,
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
            "value": "<p><strong class=\"ql-font-roboto\" style=\"font-size:15px;color:#0d9488;\">Medication Plan</strong></p>",
            "attrs": {
              "paddingTop": 14,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#e2e8f0",
              "backgroundColor": "#f0fdfa"
            }
          }
        ],
        "backgroundColor": "#f0fdfa"
      },
      {
        "type": "partial-content",
        "height": 50,
        "widths": [],
        "cells": [],
        "backgroundColor": "white",
        "partialContent": {
          "id": "partial_1755898280993",
          "name": "Partial Content",
          "tokenSource": "root",
          "rows": [
            {
              "height": 50,
              "widths": [
                100
              ],
              "cells": [
                {
                  "type": "html",
                  "value": "<table><tbody><tr><td data-row=\"row-893n\"><strong style=\"background-color: rgb(204, 224, 245);\">Medication</strong></td><td data-row=\"row-893n\"><strong style=\"background-color: rgb(204, 224, 245);\">Dose </strong></td><td data-row=\"row-893n\"><strong style=\"background-color: rgb(204, 224, 245);\">Route </strong></td><td data-row=\"row-893n\"><strong style=\"background-color: rgb(204, 224, 245);\">Frequency</strong></td></tr><tr><td data-row=\"row-ly12\">Metformin </td><td data-row=\"row-ly12\">1,000 mg</td><td data-row=\"row-ly12\">PO  </td><td data-row=\"row-ly12\">BD</td></tr><tr><td data-row=\"row-4ngn\">Empagliflo </td><td data-row=\"row-4ngn\">10 mg</td><td data-row=\"row-4ngn\">PO </td><td data-row=\"row-4ngn\">BD</td></tr><tr><td data-row=\"row-893n\">zin </td><td data-row=\"row-893n\">10 mg</td><td data-row=\"row-893n\">PO </td><td data-row=\"row-893n\">BD</td></tr></tbody></table><p><br></p>",
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
          ],
          "tokenAttributeList": []
        }
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
            "value": "<p><strong class=\"ql-font-roboto\" style=\"font-size:15px;color:#0d9488;\">Self-Management Goals</strong></p>",
            "attrs": {
              "paddingTop": 14,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#e2e8f0",
              "backgroundColor": "#f0fdfa"
            }
          }
        ],
        "backgroundColor": "#f0fdfa"
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
            "value": "<p style=\"font-size:12px;color:#0d9488;\"><strong>Patient Goals (next 3 months)</strong></p><p>• Nutrition: plate method at d inner 5×/w eek </p><p>• Activity : walk 30 minutes 4× / week </p><p>• Foot car e: daily inspection &amp; moisturing </p>",
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
            "value": "<p style=\"font-size:12px;color:#0d9488;\"><strong>Education Provided</strong></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span>None</li></ol>",
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
            "value": "<p><strong class=\"ql-font-roboto\" style=\"font-size:15px;color:#0d9488;\">Care Team & Contacts</strong></p>",
            "attrs": {
              "paddingTop": 14,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#e2e8f0",
              "backgroundColor": "#f0fdfa"
            }
          }
        ],
        "backgroundColor": "#f0fdfa"
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
            "value": "<p style=\"font-size:12px;color:#334155;\"><strong>Primary Care</strong></p><p style=\"font-size:12px;color:#334155;\">Dr. N. Patel · (555) 123-4567</p><p style=\"font-size:12px;color:#334155;\">care@seaside.example</p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 10,
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
            "value": "<p class=\"ql-align-right\" style=\"font-size:12px;color:#334155;\"><strong>Endocrinology</strong></p><p class=\"ql-align-right\" style=\"font-size:12px;color:#334155;\">Dr. A. Romero · (555) 987-6543</p><p class=\"ql-align-right\" style=\"font-size:12px;color:#334155;\">endo@seaside.example</p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 12,
              "paddingBottom": 10,
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
            "value": "<p><strong class=\"ql-font-roboto\" style=\"font-size:15px;color:#0d9488;\">Consent & Signatures</strong></p>",
            "attrs": {
              "paddingTop": 14,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#e2e8f0",
              "backgroundColor": "#f0fdfa"
            }
          }
        ],
        "backgroundColor": "#f0fdfa"
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
            "value": "<p style=\"font-size:12px;color:#334155;\"><span style=\"color: rgb(68, 68, 68);\">I agree with the plan above and consent to the recommended monitoring and medication changes. I understand when to seek urgent medical advice.</span></p>",
            "attrs": {
              "paddingTop": 12,
              "paddingRight": 8,
              "paddingBottom": 12,
              "paddingLeft": 12,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#94a3b8",
              "backgroundColor": "white"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right\" style=\"font-size:12px;color:#334155;\"><span style=\"color: rgb(68, 68, 68);\">Patient Signature: __________________________</span></p><p class=\"ql-align-right\" style=\"font-size:12px;color:#334155;\"><span style=\"color: rgb(68, 68, 68);\">Date: ____/____/______</span></p><p class=\"ql-align-right\" style=\"font-size:12px;color:#334155;\"><span style=\"color: rgb(68, 68, 68);\">Clinician: __________________________</span></p>",
            "attrs": {
              "paddingTop": 12,
              "paddingRight": 12,
              "paddingBottom": 12,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#94a3b8",
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
            "value": "<p class=\"ql-align-center\"><span style=\"font-size:11px;color:#64748b;\">This plan is for guidance and does not replace clinical judgement. Review next: 3 months.</span></p>",
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
    "headerMarginTop": 5,
    "headerMarginRight": 0,
    "headerMarginLeft": 0,
    "headerMarginBottom": 5,
    "headerHeight": 30,
    "footerMarginTop": 5,
    "footerMarginRight": 30,
    "footerMarginLeft": 30,
    "footerMarginBottom": 5,
    "footerHeight": 30,
    "backgroundColor": "white",
    "defaultFont": "Roboto"
  },
  "tokenAttrs": [],
  "partialContent": [
    {
      "id": "partial_1755898280993",
      "name": "Partial Content",
      "tokenSource": "root",
      "rows": [
        {
          "height": 50,
          "widths": [
            100
          ],
          "cells": [
            {
              "type": "html",
              "value": "<table><tbody><tr><td data-row=\"row-893n\"><strong style=\"background-color: rgb(204, 224, 245);\">Medication</strong></td><td data-row=\"row-893n\"><strong style=\"background-color: rgb(204, 224, 245);\">Dose </strong></td><td data-row=\"row-893n\"><strong style=\"background-color: rgb(204, 224, 245);\">Route </strong></td><td data-row=\"row-893n\"><strong style=\"background-color: rgb(204, 224, 245);\">Frequency</strong></td></tr><tr><td data-row=\"row-ly12\">Metformin </td><td data-row=\"row-ly12\">1,000 mg</td><td data-row=\"row-ly12\">PO  </td><td data-row=\"row-ly12\">BD</td></tr><tr><td data-row=\"row-4ngn\">Empagliflo </td><td data-row=\"row-4ngn\">10 mg</td><td data-row=\"row-4ngn\">PO </td><td data-row=\"row-4ngn\">BD</td></tr><tr><td data-row=\"row-893n\">zin </td><td data-row=\"row-893n\">10 mg</td><td data-row=\"row-893n\">PO </td><td data-row=\"row-893n\">BD</td></tr></tbody></table><p><br></p>",
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
      ],
      "tokenAttributeList": []
    }
  ],
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
