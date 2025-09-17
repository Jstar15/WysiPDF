// src/app/presets/radiology-form.grid.preset.ts
import { Page } from '../models/page';
import {TokenAttributeType} from "../models/token-attribute-type";
import {createEmptyRow} from "./default-page.preset";

export const Preset3: any = {
  "header2": { rows: [createEmptyRow()] },
  "header": {
    "rows": [
      {
        "height": 56,
        "widths": [60, 40],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:16px;color: rgb(29, 78, 216);\">NOVA RADIOLOGY</strong></p><p class=\"ql-font-roboto\"><span style=\"font-size: 11px; color: rgb(71, 85, 105);\">www.novaradiology.example · reports@nova.example</span></p>",
            "attrs": {
              "paddingTop": 10, "paddingRight": 8, "paddingBottom": 10, "paddingLeft": 10,
              "borderTop": 0, "borderRight": 0, "borderBottom": 2, "borderLeft": 0,
              "borderColor": "#1D4ED8", "backgroundColor": "transparent"
            },
            "block": {
              "blocks": [
                { "elements": [{ "value": "NOVA RADIOLOGY", "attributes": { "bold": "true", "size": 16, "font": "Roboto", "color": "#1d4ed8", "align": "left" }, "type": "text"}], "blockType": "p", "alignment": "left" },
                { "elements": [{ "value": "www.novaradiology.example · reports@nova.example", "attributes": { "size": 11, "font": "Roboto", "color": "#475569", "align": "left" }, "type": "text"}], "blockType": "p", "alignment": "left" }
              ]
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right ql-font-roboto\"><strong style=\"font-size:14px;color: rgb(29, 78, 216);\">RADIOLOGY REPORT</strong></p><p class=\"ql-align-right ql-font-roboto\"><span style=\"font-size: 11px; color: rgb(100, 116, 139);\">Report No. —</span></p>",
            "attrs": {
              "paddingTop": 10, "paddingRight": 10, "paddingBottom": 10, "paddingLeft": 8,
              "borderTop": 0, "borderRight": 0, "borderBottom": 2, "borderLeft": 0,
              "borderColor": "#1D4ED8", "backgroundColor": "transparent"
            },
            "block": {
              "blocks": [
                { "elements": [{ "value": "RADIOLOGY REPORT", "attributes": { "bold": "true", "size": 14, "font": "Roboto", "align": "right", "color": "#1d4ed8" }, "type": "text"}], "blockType": "p", "alignment": "right" },
                { "elements": [{ "value": "Report No. —", "attributes": { "size": 11, "font": "Roboto", "align": "right", "color": "#64748b" }, "type": "text"}], "blockType": "p", "alignment": "right" }
              ]
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
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:13px;color: rgb(29, 78, 216);\">Patient & Study</strong></p>",
            "attrs": {
              "paddingTop": 10, "paddingRight": 8, "paddingBottom": 6, "paddingLeft": 10,
              "borderTop": 0, "borderRight": 0, "borderBottom": 1, "borderLeft": 0,
              "borderColor": "#E5E7EB", "backgroundColor": "#EFF6FF"
            },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "#EFF6FF"
      },
      {
        "height": 0,
        "widths": [33.3333, 33.3333, 33.3334],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:11px;color: rgb(100,116,139);\"><strong>Patient</strong></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Name: <em style=\"color:#94a3b8;\">Enter full name</em></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">DOB: <em style=\"color:#94a3b8;\">DD/MM/YYYY</em> &nbsp; Sex: <em style=\"color:#94a3b8;\">M/F</em></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Patient ID: <em style=\"color:#94a3b8;\">—</em></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 8, "paddingBottom": 10, "paddingLeft": 10, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:11px;color: rgb(100,116,139);\"><strong>Study</strong></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Modality: <em style=\"color:#94a3b8;\">CT/MRI/US/XR</em> &nbsp; Body Part: <em style=\"color:#94a3b8;\">—</em></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Laterality: <em style=\"color:#94a3b8;\">Left/Right/Bilateral</em></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Study Date/Time: <em style=\"color:#94a3b8;\">—</em></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 8, "paddingBottom": 10, "paddingLeft": 8, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:11px;color: rgb(100,116,139);\"><strong>Safety</strong></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Allergies: <em style=\"color:#94a3b8;\">NKDA or list</em></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Pregnancy status (if applicable): <em style=\"color:#94a3b8;\">—</em></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Implants/Devices: <em style=\"color:#94a3b8;\">—</em></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 10, "paddingBottom": 10, "paddingLeft": 8, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "white"
      },

      {
        "height": 0,
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:13px;color: rgb(29, 78, 216);\">Referrer & Clinical Indication</strong></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 8, "paddingBottom": 6, "paddingLeft": 10, "borderTop": 0, "borderRight": 0, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB", "backgroundColor": "#EFF6FF" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "#EFF6FF"
      },
      {
        "height": 0,
        "widths": [40, 60],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;\">Referring Clinician: <em style=\"color:#94a3b8;\">—</em></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Contact: <em style=\"color:#94a3b8;\">—</em> &nbsp; Priority: <em style=\"color:#94a3b8;\">Routine/Urgent</em></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 8, "paddingBottom": 10, "paddingLeft": 10, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;\">Clinical Indication / History:</p><p class=\"ql-font-roboto\" style=\"font-size:12px;color:#94a3b8;\">Provide succinct clinical question, symptoms, duration, and relevant prior interventions.</p>",
            "attrs": { "paddingTop": 10, "paddingRight": 10, "paddingBottom": 10, "paddingLeft": 10, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "white"
      },

      {
        "height": 0,
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:13px;color: rgb(29, 78, 216);\">Technique</strong></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 8, "paddingBottom": 6, "paddingLeft": 10, "borderTop": 0, "borderRight": 0, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB", "backgroundColor": "#EFF6FF" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "#EFF6FF"
      },
      {
        "height": 0,
        "widths": [34, 33, 33],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span style=\"color:rgb(100,116,139);\"><strong>Protocol / Sequences</strong></span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;color:#94a3b8;\">e.g., MRI brain: T1, T2, FLAIR, DWI, SWI; CT chest: helical, 1 mm recon.</p>",
            "attrs": { "paddingTop": 8, "paddingRight": 8, "paddingBottom": 8, "paddingLeft": 10, "borderTop": 0, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span style=\"color:rgb(100,116,139);\"><strong>Contrast</strong></span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Use: ☐ None ☐ Yes &nbsp; Type: <em style=\"color:#94a3b8;\">—</em> &nbsp; Volume (mL): <em style=\"color:#94a3b8;\">—</em></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Adverse reactions/notes: <em style=\"color:#94a3b8;\">—</em></p>",
            "attrs": { "paddingTop": 8, "paddingRight": 8, "paddingBottom": 8, "paddingLeft": 8, "borderTop": 0, "borderRight": 1, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span style=\"color:rgb(100,116,139);\"><strong>Preparation</strong></span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Sedation: ☐ No ☐ Yes &nbsp; Type: <em style=\"color:#94a3b8;\">—</em></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Artefacts/Limitations: <em style=\"color:#94a3b8;\">—</em></p>",
            "attrs": { "paddingTop": 8, "paddingRight": 10, "paddingBottom": 8, "paddingLeft": 8, "borderTop": 0, "borderRight": 1, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "white"
      },

      {
        "height": 0,
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:13px;color: rgb(29, 78, 216);\">Radiation Dose (CT)</strong></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 8, "paddingBottom": 6, "paddingLeft": 10, "borderTop": 0, "borderRight": 0, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB", "backgroundColor": "#EFF6FF" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "#EFF6FF"
      },
      {
        "height": 0,
        "widths": [33.3333, 33.3333, 33.3334],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;\">CTDIvol (mGy): <em style=\"color:#94a3b8;\">—</em></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">DLP (mGy·cm): <em style=\"color:#94a3b8;\">—</em></p>",
            "attrs": { "paddingTop": 8, "paddingRight": 8, "paddingBottom": 8, "paddingLeft": 10, "borderTop": 0, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;\">Scan Range: <em style=\"color:#94a3b8;\">—</em></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Series Count: <em style=\"color:#94a3b8;\">—</em></p>",
            "attrs": { "paddingTop": 8, "paddingRight": 8, "paddingBottom": 8, "paddingLeft": 8, "borderTop": 0, "borderRight": 1, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;\">Dose Comments: <em style=\"color:#94a3b8;\">Iterative recon, dose modulation, etc.</em></p>",
            "attrs": { "paddingTop": 8, "paddingRight": 10, "paddingBottom": 8, "paddingLeft": 8, "borderTop": 0, "borderRight": 1, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "white"
      },

      {
        "height": 0,
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:13px;color: rgb(29, 78, 216);\">Comparison</strong></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 8, "paddingBottom": 6, "paddingLeft": 10, "borderTop": 0, "borderRight": 0, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB", "backgroundColor": "#EFF6FF" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "#EFF6FF"
      },
      {
        "height": 0,
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;\">Compared with: <em style=\"color:#94a3b8;\">Prior study date and modality</em></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Summary of changes: <em style=\"color:#94a3b8;\">Stable/improved/worsened; key differences</em></p>",
            "attrs": { "paddingTop": 8, "paddingRight": 10, "paddingBottom": 8, "paddingLeft": 10, "borderTop": 0, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "white"
      },

      {
        "height": 0,
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:13px;color: rgb(29, 78, 216);\">Findings</strong></p>",
            "attrs": { "paddingTop": 12, "paddingRight": 8, "paddingBottom": 6, "paddingLeft": 10, "borderTop": 0, "borderRight": 0, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB", "backgroundColor": "#EFF6FF" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "#EFF6FF"
      },
      {
        "height": 0,
        "widths": [28, 52, 20],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size: 11px; color: rgb(100, 116, 139);\">Region/System</strong></p>",
            "attrs": { "paddingTop": 8, "paddingRight": 8, "paddingBottom": 8, "paddingLeft": 10, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#CBD5E1", "backgroundColor": "#F8FAFC" },
            "block": { "blocks": [] }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size: 11px; color: rgb(100, 116, 139);\">Observation / Description</strong></p>",
            "attrs": { "paddingTop": 8, "paddingRight": 8, "paddingBottom": 8, "paddingLeft": 8, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 0, "borderColor": "#CBD5E1", "backgroundColor": "#F8FAFC" },
            "block": { "blocks": [] }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right ql-font-roboto\"><strong style=\"font-size: 11px; color: rgb(100, 116, 139);\">Measurement</strong></p>",
            "attrs": { "paddingTop": 8, "paddingRight": 10, "paddingBottom": 8, "paddingLeft": 8, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 0, "borderColor": "#CBD5E1", "backgroundColor": "#F8FAFC" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "white"
      },
      {
        "height": 44,
        "widths": [28, 52, 20],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;\">Chest / Lungs</p>",
            "attrs": { "paddingTop": 6, "paddingRight": 6, "paddingBottom": 6, "paddingLeft": 10, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#94a3b8" },
            "block": { "blocks": [] }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#94a3b8;\">Clear fields; no consolidation; no pleural effusion. (Edit as needed)</p>",
            "attrs": { "paddingTop": 6, "paddingRight": 6, "paddingBottom": 6, "paddingLeft": 8, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#94a3b8" },
            "block": { "blocks": [] }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right\" style=\"font-size:12px;color:#94a3b8;\">—</p>",
            "attrs": { "paddingTop": 6, "paddingRight": 10, "paddingBottom": 6, "paddingLeft": 6, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#94a3b8" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "white"
      },
      {
        "height": 44,
        "widths": [28, 52, 20],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;\">Mediastinum / Heart</p>",
            "attrs": { "paddingTop": 6, "paddingRight": 6, "paddingBottom": 6, "paddingLeft": 10, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#94a3b8" }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#94a3b8;\">Cardiomediastinal contours within normal limits.</p>",
            "attrs": { "paddingTop": 6, "paddingRight": 6, "paddingBottom": 6, "paddingLeft": 8, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#94a3b8" }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right\" style=\"font-size:12px;color:#94a3b8;\">—</p>",
            "attrs": { "paddingTop": 6, "paddingRight": 10, "paddingBottom": 6, "paddingLeft": 6, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#94a3b8" }
          }
        ],
        "backgroundColor": "white"
      },
      {
        "height": 44,
        "widths": [28, 52, 20],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;\">Abdomen / Solid Organs</p>",
            "attrs": { "paddingTop": 6, "paddingRight": 6, "paddingBottom": 6, "paddingLeft": 10, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#94a3b8" }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#94a3b8;\">Liver, spleen, pancreas unremarkable. No biliary dilatation.</p>",
            "attrs": { "paddingTop": 6, "paddingRight": 6, "paddingBottom": 6, "paddingLeft": 8, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#94a3b8" }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right\" style=\"font-size:12px;color:#94a3b8;\">—</p>",
            "attrs": { "paddingTop": 6, "paddingRight": 10, "paddingBottom": 6, "paddingLeft": 6, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#94a3b8" }
          }
        ],
        "backgroundColor": "white"
      },
      {
        "height": 44,
        "widths": [28, 52, 20],
        "cells": [
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;\">Bones / Soft Tissues</p>",
            "attrs": { "paddingTop": 6, "paddingRight": 6, "paddingBottom": 6, "paddingLeft": 10, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#94a3b8" }
          },
          {
            "type": "html",
            "value": "<p style=\"font-size:12px;color:#94a3b8;\">No acute osseous abnormality identified.</p>",
            "attrs": { "paddingTop": 6, "paddingRight": 6, "paddingBottom": 6, "paddingLeft": 8, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#94a3b8" }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right\" style=\"font-size:12px;color:#94a3b8;\">—</p>",
            "attrs": { "paddingTop": 6, "paddingRight": 10, "paddingBottom": 6, "paddingLeft": 6, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#94a3b8" }
          }
        ],
        "backgroundColor": "white"
      },

      {
        "height": 0,
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:13px;color: rgb(29, 78, 216);\">Impression</strong></p>",
            "attrs": { "paddingTop": 12, "paddingRight": 8, "paddingBottom": 6, "paddingLeft": 10, "borderTop": 0, "borderRight": 0, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB", "backgroundColor": "#EFF6FF" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "#EFF6FF"
      },
      {
        "height": 0,
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p>1) <em style=\"color:#94a3b8;\">Primary takeaway / diagnosis.</em></p><p>2) <em style=\"color:#94a3b8;\">Secondary findings of clinical relevance.</em></p><p>3) <em style=\"color:#94a3b8;\">If applicable, rule-out statements.</em></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 10, "paddingBottom": 10, "paddingLeft": 10, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "white"
      },

      {
        "height": 0,
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:13px;color: rgb(29, 78, 216);\">Recommendations</strong></p>",
            "attrs": { "paddingTop": 12, "paddingRight": 8, "paddingBottom": 6, "paddingLeft": 10, "borderTop": 0, "borderRight": 0, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB", "backgroundColor": "#EFF6FF" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "#EFF6FF"
      },
      {
        "height": 0,
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;\">Follow-up: <em style=\"color:#94a3b8;\">Timeframe / modality / targeted area</em></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\">Additional tests: <em style=\"color:#94a3b8;\">Lab, imaging, or referral</em></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 10, "paddingBottom": 10, "paddingLeft": 10, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "white"
      },

      {
        "height": 0,
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:13px;color: rgb(29, 78, 216);\">Communication</strong></p>",
            "attrs": { "paddingTop": 12, "paddingRight": 8, "paddingBottom": 6, "paddingLeft": 10, "borderTop": 0, "borderRight": 0, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB", "backgroundColor": "#EFF6FF" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "#EFF6FF"
      },
      {
        "height": 0,
        "widths": [50, 50],
        "cells": [
          {
            "type": "html",
            "value": "<p>Critical Result Notified: ☐ Yes &nbsp; ☐ No</p><p>Recipient: <em style=\"color:#94a3b8;\">Name/role</em> &nbsp; Date/Time: <em style=\"color:#94a3b8;\">—</em></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 8, "paddingBottom": 10, "paddingLeft": 10, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          },
          {
            "type": "html",
            "value": "<p>Method: <em style=\"color:#94a3b8;\">Phone / Secure message / In person</em></p><p>Reference ID / Ticket: <em style=\"color:#94a3b8;\">—</em></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 10, "paddingBottom": 10, "paddingLeft": 10, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "white"
      },

      {
        "height": 0,
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:13px;color: rgb(29, 78, 216);\">Radiologist & Verification</strong></p>",
            "attrs": { "paddingTop": 12, "paddingRight": 8, "paddingBottom": 6, "paddingLeft": 10, "borderTop": 0, "borderRight": 0, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB", "backgroundColor": "#EFF6FF" },
            "block": { "blocks": [] }
          }
        ],
        "backgroundColor": "#EFF6FF"
      },
      {
        "height": 64,
        "widths": [60, 40],
        "cells": [
          {
            "type": "html",
            "value": "<p><strong>Reporting Radiologist:</strong> <em style=\"color:#94a3b8;\">Name, credentials</em></p><p><strong>License No.:</strong> <em style=\"color:#94a3b8;\">—</em></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 8, "paddingBottom": 10, "paddingLeft": 10, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 1, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right\"><strong>Signed:</strong> <em style=\"color:#94a3b8;\">—</em></p><p class=\"ql-align-right\"><strong>Date/Time:</strong> <em style=\"color:#94a3b8;\">—</em></p>",
            "attrs": { "paddingTop": 10, "paddingRight": 10, "paddingBottom": 10, "paddingLeft": 8, "borderTop": 1, "borderRight": 1, "borderBottom": 1, "borderLeft": 0, "borderColor": "#E5E7EB" },
            "block": { "blocks": [] }
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
        "widths": [100],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-align-center ql-font-roboto\"><span style=\"font-size: 11px; color: rgb(100, 116, 139);\">NOVA RADIOLOGY · 123 Health Ave, London · (020) 9876 5432</span></p>",
            "attrs": {
              "paddingTop": 8, "paddingRight": 8, "paddingBottom": 8, "paddingLeft": 8,
              "borderTop": 1, "borderRight": 0, "borderBottom": 0, "borderLeft": 0,
              "borderColor": "#E5E7EB", "backgroundColor": "transparent"
            },
            "block": {
              "blocks": [
                { "elements": [{ "value": "NOVA RADIOLOGY · 123 Health Ave, London · (020) 9876 5432", "attributes": { "size": 11, "font": "Roboto", "align": "center", "color": "#64748b" }, "type": "text"}], "blockType": "p", "alignment": "center" }
              ]
            }
          }
        ],
        "backgroundColor": "white"
      }
    ]
  },

  "pageAttrs": {
    "marginTop": 35, "marginRight": 30, "marginLeft": 30, "marginBottom": 24,
    "headerMarginTop": 5, "headerMarginRight": 0, "headerMarginLeft": 0, "headerMarginBottom": 5, "headerHeight": 60,
    "footerMarginTop": 5, "footerMarginRight": 30, "footerMarginLeft": 30, "footerMarginBottom": 5, "footerHeight": 40,
    "backgroundColor": "white", "defaultFont": "Roboto",
    "dontBreakRows": true,
    "pageNumbering": true
  },
  partialContent:[],
  "colorPalettes": [
    "#000000","#111827","#1F2937","#374151","#4B5563","#6B7280","#9CA3AF","#D1D5DB","#E5E7EB","#FFFFFF",
    "#1D4ED8","#2563EB","#3B82F6","#6366F1","#818CF8","#065F46","#10B981","#34D399","#86EFAC",
    "#B45309","#F59E0B","#FBBF24","#FB923C","#B91C1C","#EF4444","#F87171","#FCA5A5","#8B5CF6","#A78BFA","#DDD6FE"
  ]
};
