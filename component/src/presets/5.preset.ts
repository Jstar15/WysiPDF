// src/app/presets/invoice.preset.ts
import { Page } from '../models/interfaces';
import {TokenAttributeTypeEnum} from "../models/TokenAttributeTypeEnum";

export const Preset5: Page = {
  "header": {
    "rows": [
      {
        "height": 56,
        "widths": [
          60,
          40
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:16px;color: rgb(29, 78, 216);\">NOVA SUPPLY CO.</strong></p><p class=\"ql-font-roboto\"><span style=\"font-size: 11px; color: rgb(71, 85, 105);\">www.novasupply.example · support@nova.example</span></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 10,
              "paddingLeft": 10,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 2,
              "borderLeft": 0,
              "borderColor": "#1D4ED8",
              "backgroundColor": "transparent"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right ql-font-roboto\"><strong style=\"font-size:14px;color: rgb(29, 78, 216);\">INVOICE</strong></p><p class=\"ql-align-right ql-font-roboto\"><span style=\"font-size: 11px; color: rgb(100, 116, 139);\">No. INV-2025-0087</span></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 10,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 2,
              "borderLeft": 0,
              "borderColor": "#1D4ED8",
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
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:13px;color: rgb(29, 78, 216);\">Billing</strong></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 6,
              "paddingLeft": 10,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#E5E7EB",
              "backgroundColor": "#EFF6FF"
            }
          }
        ],
        "backgroundColor": "#EFF6FF"
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
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;color: rgb(71, 85, 105);\"><strong style=\"font-size: 10px;\">Bill To</strong></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"Alexandra Mills\" data-type=\"text\" data-name=\"customer.name\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[customer.name]</span>﻿</span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"71 Riverbank Way\" data-type=\"text\" data-name=\"customer.address1\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[customer.address1]</span>﻿</span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"London\" data-type=\"text\" data-name=\"customer.city\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[customer.city]</span>﻿</span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"SW1A 1AA\" data-type=\"text\" data-name=\"customer.postcode\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[customer.postcode]</span>﻿</span></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 10,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#E5E7EB"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;color: rgb(71, 85, 105);\"><strong style=\"font-size: 10px;\">Ship To</strong></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"Alexandra Mills\" data-type=\"text\" data-name=\"shipping.name\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[shipping.name]</span>﻿</span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"71 Riverbank Way\" data-type=\"text\" data-name=\"shipping.address1\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[shipping.address1]</span>﻿</span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"London\" data-type=\"text\" data-name=\"shipping.city\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[shipping.city]</span>﻿</span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"SW1A 1AA\" data-type=\"text\" data-name=\"shipping.postcode\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[shipping.postcode]</span>﻿</span></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 10,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#E5E7EB"
            }
          }
        ],
        "backgroundColor": "white"
      },
      {
        "height": 0,
        "widths": [
          33.3333,
          33.3333,
          33.3334
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:11px;color: rgb(100, 116, 139);\"><strong style=\"font-size: 10px;\">Invoice No.</strong></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"INV-2025-0087\" data-type=\"text\" data-name=\"invoice.number\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[invoice.number]</span>﻿</span></p>",
            "attrs": {
              "paddingTop": 8,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 10,
              "borderTop": 0,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#E5E7EB"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:11px;color: rgb(100, 116, 139);\"><strong style=\"font-size: 10px;\">Invoice Date</strong></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"2025-03-14\" data-type=\"text\" data-name=\"invoice.date\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[invoice.date]</span>﻿</span></p>",
            "attrs": {
              "paddingTop": 8,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#E5E7EB"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:11px;color: rgb(100, 116, 139);\"><strong style=\"font-size: 10px;\">Due Date</strong></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"2025-03-28\" data-type=\"text\" data-name=\"invoice.dueDate\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[invoice.dueDate]</span>﻿</span></p>",
            "attrs": {
              "paddingTop": 8,
              "paddingRight": 10,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 0,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#E5E7EB"
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
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:13px;color: rgb(29, 78, 216);\">Line Items</strong></p>",
            "attrs": {
              "paddingTop": 12,
              "paddingRight": 8,
              "paddingBottom": 6,
              "paddingLeft": 10,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#E5E7EB",
              "backgroundColor": "#EFF6FF"
            }
          }
        ],
        "backgroundColor": "#EFF6FF"
      },
      {
        "height": 0,
        "widths": [
          50,
          15,
          15,
          20
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size: 11px; color: rgb(100, 116, 139);\">Description</strong></p>",
            "attrs": {
              "paddingTop": 8,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#CBD5E1",
              "backgroundColor": "#F8FAFC"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right ql-font-roboto\"><strong style=\"font-size: 11px; color: rgb(100, 116, 139);\">Qty</strong></p>",
            "attrs": {
              "paddingTop": 8,
              "paddingRight": 10,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#CBD5E1",
              "backgroundColor": "#F8FAFC"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right ql-font-roboto\"><strong style=\"font-size: 11px; color: rgb(100, 116, 139);\">Unit</strong></p>",
            "attrs": {
              "paddingTop": 8,
              "paddingRight": 10,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#CBD5E1",
              "backgroundColor": "#F8FAFC"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right ql-font-roboto\"><strong style=\"font-size: 11px; color: rgb(100, 116, 139);\">Amount</strong></p>",
            "attrs": {
              "paddingTop": 8,
              "paddingRight": 10,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#CBD5E1",
              "backgroundColor": "#F8FAFC"
            }
          }
        ],
        "backgroundColor": "white"
      },
      {
        "type": "partial-content",
        "height": 50,
        "widths": [],
        "cells": [],
        "backgroundColor": "white",
        "partialContent": {
          "id": "partial_1756413069962",
          "name": "Partial Content",
          "tokenSource": "items",
          "rows": [
            {
              "height": 50,
              "widths": [
                50.08038585209003,
                14.871382636655946,
                15.032154340836012,
                20.016077170418004
              ],
              "cells": [
                {
                  "type": "html",
                  "value": "<p><span class=\"ql-mathjax custom-token\" data-value=\"\" data-type=\"text\" data-name=\"items.description\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[items.description]</span>﻿</span></p>",
                  "attrs": {
                    "paddingTop": 5,
                    "paddingRight": 5,
                    "paddingBottom": 5,
                    "paddingLeft": 5,
                    "borderTop": 1,
                    "borderRight": 1,
                    "borderBottom": 1,
                    "borderLeft": 1,
                    "borderColor": "#94a3b8",
                    "backgroundColor": "transparent"
                  }
                },
                {
                  "type": "html",
                  "value": "<p><span class=\"ql-mathjax custom-token\" data-value=\"\" data-type=\"number\" data-name=\"items.qty\" contenteditable=\"false\">﻿<span contenteditable=\"false\">number[items.qty]</span>﻿</span></p>",
                  "attrs": {
                    "paddingTop": 5,
                    "paddingRight": 5,
                    "paddingBottom": 5,
                    "paddingLeft": 5,
                    "borderTop": 1,
                    "borderRight": 1,
                    "borderBottom": 1,
                    "borderLeft": 1,
                    "borderColor": "#94a3b8",
                    "backgroundColor": "transparent"
                  }
                },
                {
                  "type": "html",
                  "value": "<p><span class=\"ql-mathjax custom-token\" data-value=\"\" data-type=\"number\" data-name=\"items.unitPrice\" contenteditable=\"false\">﻿<span contenteditable=\"false\">number[items.unitPrice]</span>﻿</span></p>",
                  "attrs": {
                    "paddingTop": 5,
                    "paddingRight": 5,
                    "paddingBottom": 5,
                    "paddingLeft": 5,
                    "borderTop": 1,
                    "borderRight": 1,
                    "borderBottom": 1,
                    "borderLeft": 1,
                    "borderColor": "#94a3b8",
                    "backgroundColor": "transparent"
                  }
                },
                {
                  "type": "html",
                  "value": "<p>£<span class=\"ql-mathjax custom-token\" data-value=\"\" data-type=\"number\" data-name=\"items.amount\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">number[items.amount]</span>﻿</span>﻿</span></p>",
                  "attrs": {
                    "paddingTop": 5,
                    "paddingRight": 5,
                    "paddingBottom": 5,
                    "paddingLeft": 5,
                    "borderTop": 1,
                    "borderRight": 1,
                    "borderBottom": 1,
                    "borderLeft": 1,
                    "borderColor": "#94a3b8",
                    "backgroundColor": "transparent"
                  }
                }
              ],
              "backgroundColor": "white"
            }
          ],
          "tokenAttributeList": [
            {
              "name": "items.description",
              "value": "",
              "type": TokenAttributeTypeEnum.TEXT
            },
            {
              "name": "items.qty",
              "value": "",
              "type": TokenAttributeTypeEnum.NUMBER
            },
            {
              "name": "items.unitPrice",
              "value": "",
              "type": TokenAttributeTypeEnum.NUMBER
            },
            {
              "name": "items.amount",
              "value": "",
              "type": TokenAttributeTypeEnum.NUMBER
            }
          ]
        }
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
          60,
          40
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:11px;color: rgb(100, 116, 139);\"><strong style=\"font-size: 10px;\">Notes</strong></p><p class=\"ql-font-roboto\" style=\"font-size:11px;\">Payment due within 14 days. Thank you for your business.</p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 8,
              "paddingBottom": 10,
              "paddingLeft": 10,
              "borderTop": 0,
              "borderRight": 0,
              "borderBottom": 0,
              "borderLeft": 1,
              "borderColor": "#FFFFFF",
              "backgroundColor": "transparent"
            }
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right ql-font-roboto\" style=\"font-size:12px;\"><strong>Subtotal</strong> £<span class=\"ql-mathjax custom-token\" data-value=\"1020\" data-type=\"number\" data-name=\"invoice.subtotal\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">number[invoice.subtotal]</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p class=\"ql-align-right ql-font-roboto\" style=\"font-size:12px;\">VAT (20%) £<span class=\"ql-mathjax custom-token\" data-value=\"204\" data-type=\"number\" data-name=\"invoice.vatAmount\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">number[invoice.vatAmount]</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></p><p class=\"ql-align-right ql-font-roboto\" style=\"font-size:13px;color: rgb(29, 78, 216);\"><strong style=\"color: rgb(29, 78, 216);\">Total £</strong><strong style=\"color: rgb(37, 99, 235);\"><span class=\"ql-mathjax custom-token\" data-value=\"1224\" data-type=\"number\" data-name=\"invoice.total\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">number[invoice.total]</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span>﻿</span></strong></p>",
            "attrs": {
              "paddingTop": 10,
              "paddingRight": 10,
              "paddingBottom": 10,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#E5E7EB",
              "backgroundColor": "#F8FAFC"
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
            "value": "<p class=\"ql-font-roboto\"><strong style=\"font-size:12px;color: rgb(29, 78, 216);\">Pay Online</strong></p><p class=\"ql-font-roboto\" style=\"font-size:11px;\">Scan the code or visit the link in your email to complete payment securely.</p>",
            "attrs": {
              "paddingTop": 12,
              "paddingRight": 8,
              "paddingBottom": 12,
              "paddingLeft": 10,
              "borderTop": 1,
              "borderRight": 0,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#E5E7EB",
              "backgroundColor": "white"
            }
          },
          {
            "type": "barcode",
            "value": "",
            "barcodeBlock": {
              "imageBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAABuCAYAAADibmt+AAADaElEQVR4AeySC47kIAxE47n/nXulRNZOW0nEBAj+vJY6FmCMXfV+PvxQ4ESBn40fCpwoABgnorC1bYABBacKAMapLGwCBgycKgAYp7KwCRiDGchSDjCyODl4DsAYLGiWcs1giMgm8v+vAogce7rWKHK+r+caRY48kSPafV3bKHLki3xHzRM539dzjSJHnl2LHPsiR7TnurZR5MgX+Y6aJ/K3fb2nUeT7vsixtud2LfKdp+dXsRmMqwLs51QAMHL62j0VYHRLmLMAYOT0tXsqN2B0T0KBoQoAxlA58xQDjDxeDp0EMIbKmacYYOTxcugkgDFUzjzFACOPl0MnAYyhcjoq1tkKYHQKmPU6YGR1tnMuwOgUMOt1wMjqbOdcgNEpYNbrgJHV2c65AKNTwKzXAcM6y3pXADB2GfhYBQDDKsJ6VwAwdhn4WAUAwyrCelcAMHYZ+FgFAMMqwnpXADB2GfhYBcaBYSuzDq0AYIS2b17zgDFP29CVASO0ffOaB4x52oauDBih7ZvXPGDM0zZ0ZcBwa9/axgBjrf5uXwcMt9asbQww1urv9nXAcGvN2sYAY63+bl8HDLfWrG0MMNbq7/b1hGC41TpUY4ARyq73mgWM97QO9RJghLLrvWYB4z2tQ70EGKHseq9ZwHhP61AvAUYou95r9hcY7z3KS/4VAAz/Hi3pEDCWyO7/UcDw79GSDgFjiez+HwUM/x4t6RAwlsju/1HAmOdR6MqAEdq+ec0DxjxtQ1cGjND2zWseMOZpG7oyYIS2b17zgDFP29CVASO0ffOa9wjGvGmp3KwAYDRLVSsRMGr53TwtYDRLVSsRMGr53TwtYDRLVSsRMGr53TwtYDRLFTfxSeeA8US1AncAo4DJT0YEjCeqFbgDGAVMfjIiYDxRrcAdwChg8pMRAeOJagXuAMaNyZWPAKOy+zezA8aNOJWPAKOy+zezA8aNOJWPAKOy+zezA8aNOJWPAKOy+zezTwHj5j2OgijQDMbn89l+/3U+3dO1xqt9PdeoeRrtvq5t1HwbNe9qX881ap5d675Ge65rGzXfRs37677e02jv69qe27XN0/Or2AzGVQH2cyoAGDl97Z4KMLolzFkAMHL62j0VYHRLmLMAYETwdUGPgLFA9AhPAkYElxb0CBgLRI/w5D8AAAD//2T/CqUAAAAGSURBVAMApAvK43AohtsAAAAASUVORK5CYII=",
              "filename": "[token:barcode.format]",
              "width": 70,
              "alignment": "right",
              "HtmlTokenElement": {
                "key": "barcode.format",
                "type": "barcode"
              }
            },
            "attrs": {
              "paddingTop": 8,
              "paddingRight": 10,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 0,
              "borderColor": "#E5E7EB",
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
            "value": "<p class=\"ql-align-center ql-font-roboto\"><span style=\"font-size: 11px; color: rgb(100, 116, 139);\">NOVA SUPPLY CO. · 221B Market Street, London · (020) 1234 5678</span></p>",
            "attrs": {
              "paddingTop": 8,
              "paddingRight": 8,
              "paddingBottom": 8,
              "paddingLeft": 8,
              "borderTop": 1,
              "borderRight": 0,
              "borderBottom": 0,
              "borderLeft": 0,
              "borderColor": "#E5E7EB",
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
  "tokenAttrs": [
    {
      "name": "company.name",
      "value": "NOVA SUPPLY CO.",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "company.website",
      "value": "https://novasupply.example",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "company.email",
      "value": "support@nova.example",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "company.phone",
      "value": "(020) 1234 5678",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "company.address",
      "value": "221B Market Street, London",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "invoice.number",
      "value": "INV-2025-0087",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "invoice.date",
      "value": "2025-03-14",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "invoice.dueDate",
      "value": "2025-03-28",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "invoice.currency",
      "value": "GBP",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "invoice.notes",
      "value": "Payment due within 14 days. Thank you for your business.",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "invoice.subtotal",
      "value": "1020",
      "type": TokenAttributeTypeEnum.NUMBER
    },
    {
      "name": "invoice.vatRate",
      "value": "0.2",
      "type": TokenAttributeTypeEnum.NUMBER
    },
    {
      "name": "invoice.vatAmount",
      "value": "204",
      "type": TokenAttributeTypeEnum.NUMBER
    },
    {
      "name": "invoice.total",
      "value": "1224",
      "type": TokenAttributeTypeEnum.NUMBER
    },
    {
      "name": "invoice.paymentUrl",
      "value": "https://pay.nova.example/i/INV-2025-0087",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "customer.name",
      "value": "Alexandra Mills",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "customer.address1",
      "value": "71 Riverbank Way",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "customer.city",
      "value": "London",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "customer.postcode",
      "value": "SW1A 1AA",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "customer.country",
      "value": "United Kingdom",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "shipping.name",
      "value": "Alexandra Mills",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "shipping.address1",
      "value": "71 Riverbank Way",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "shipping.city",
      "value": "London",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "shipping.postcode",
      "value": "SW1A 1AA",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "shipping.country",
      "value": "United Kingdom",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "items",
      "value": "[{\"description\":\"Consulting services – March\",\"qty\":12,\"unitPrice\":75,\"amount\":900},{\"description\":\"Premium support plan\",\"qty\":1,\"unitPrice\":120,\"amount\":120}]",
      "type": TokenAttributeTypeEnum.JSON_ARRAY
    },
    {
      "name": "totals.lines",
      "value": "[{\"label\":\"Subtotal\",\"value\":1020,\"emphasis\":false},{\"label\":\"VAT (20%)\",\"value\":204,\"emphasis\":false},{\"label\":\"Total\",\"value\":1224,\"emphasis\":true}]",
      "type": TokenAttributeTypeEnum.JSON_ARRAY
    },
    {
      "name": "barcode.format",
      "value": "QR",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "barcode.value",
      "value": "https://pay.nova.example/i/INV-2025-0087",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "barcode.imageBase64",
      "value": "data:image/png;base64,{{INVOICE_BARCODE_BASE64}}",
      "type": TokenAttributeTypeEnum.TEXT
    },
    {
      "name": "footer.line",
      "value": "NOVA SUPPLY CO. · 221B Market Street, London · (020) 1234 5678",
      "type": TokenAttributeTypeEnum.TEXT
    }
  ],
  "partialContent": [
    {
      "id": "partial_1756413069962",
      "name": "Partial Content",
      "tokenSource": "items",
      "rows": [
        {
          "height": 50,
          "widths": [
            50.08038585209003,
            14.871382636655946,
            15.032154340836012,
            20.016077170418004
          ],
          "cells": [
            {
              "type": "html",
              "value": "<p><span class=\"ql-mathjax custom-token\" data-value=\"\" data-type=\"text\" data-name=\"items.description\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[items.description]</span>﻿</span></p>",
              "attrs": {
                "paddingTop": 5,
                "paddingRight": 5,
                "paddingBottom": 5,
                "paddingLeft": 5,
                "borderTop": 1,
                "borderRight": 1,
                "borderBottom": 1,
                "borderLeft": 1,
                "borderColor": "#94a3b8",
                "backgroundColor": "transparent"
              }
            },
            {
              "type": "html",
              "value": "<p><span class=\"ql-mathjax custom-token\" data-value=\"\" data-type=\"number\" data-name=\"items.qty\" contenteditable=\"false\">﻿<span contenteditable=\"false\">number[items.qty]</span>﻿</span></p>",
              "attrs": {
                "paddingTop": 5,
                "paddingRight": 5,
                "paddingBottom": 5,
                "paddingLeft": 5,
                "borderTop": 1,
                "borderRight": 1,
                "borderBottom": 1,
                "borderLeft": 1,
                "borderColor": "#94a3b8",
                "backgroundColor": "transparent"
              }
            },
            {
              "type": "html",
              "value": "<p><span class=\"ql-mathjax custom-token\" data-value=\"\" data-type=\"number\" data-name=\"items.unitPrice\" contenteditable=\"false\">﻿<span contenteditable=\"false\">number[items.unitPrice]</span>﻿</span></p>",
              "attrs": {
                "paddingTop": 5,
                "paddingRight": 5,
                "paddingBottom": 5,
                "paddingLeft": 5,
                "borderTop": 1,
                "borderRight": 1,
                "borderBottom": 1,
                "borderLeft": 1,
                "borderColor": "#94a3b8",
                "backgroundColor": "transparent"
              }
            },
            {
              "type": "html",
              "value": "<p>£<span class=\"ql-mathjax custom-token\" data-value=\"\" data-type=\"number\" data-name=\"items.amount\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">number[items.amount]</span>﻿</span>﻿</span></p>",
              "attrs": {
                "paddingTop": 5,
                "paddingRight": 5,
                "paddingBottom": 5,
                "paddingLeft": 5,
                "borderTop": 1,
                "borderRight": 1,
                "borderBottom": 1,
                "borderLeft": 1,
                "borderColor": "#94a3b8",
                "backgroundColor": "transparent"
              }
            }
          ],
          "backgroundColor": "white"
        }
      ],
      "tokenAttributeList": [
        {
          "name": "items.description",
          "value": "",
          "type": TokenAttributeTypeEnum.TEXT
        },
        {
          "name": "items.qty",
          "value": "",
          "type": TokenAttributeTypeEnum.NUMBER
        },
        {
          "name": "items.unitPrice",
          "value": "",
          "type": TokenAttributeTypeEnum.NUMBER
        },
        {
          "name": "items.amount",
          "value": "",
          "type": TokenAttributeTypeEnum.NUMBER
        }
      ]
    }
  ],
  "colorPalettes": [
    "#000000",
    "#111827",
    "#1F2937",
    "#374151",
    "#4B5563",
    "#6B7280",
    "#9CA3AF",
    "#D1D5DB",
    "#E5E7EB",
    "#FFFFFF",
    "#1D4ED8",
    "#2563EB",
    "#3B82F6",
    "#6366F1",
    "#818CF8",
    "#065F46",
    "#10B981",
    "#34D399",
    "#86EFAC",
    "#B45309",
    "#F59E0B",
    "#FBBF24",
    "#FB923C",
    "#B91C1C",
    "#EF4444",
    "#F87171",
    "#FCA5A5",
    "#8B5CF6",
    "#A78BFA",
    "#DDD6FE"
  ]
}
