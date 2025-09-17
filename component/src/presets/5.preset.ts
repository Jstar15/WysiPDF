// src/app/presets/invoice.preset.ts
import { Page } from '../models/page';
import {TokenAttributeType} from "../models/token-attribute-type";
import {createEmptyRow} from "./default-page.preset";

export const Preset5: any = {
  "header2": { rows: [createEmptyRow()] },
  "header": {
    "rows": [
      {
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "NOVA SUPPLY CO.",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 16,
                        "font": "Roboto",
                        "color": "#1d4ed8",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "www.novasupply.example · support@nova.example",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 11,
                        "font": "Roboto",
                        "color": "#475569",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right ql-font-roboto\"><strong style=\"font-size:14px;color: rgb(29, 78, 216);\">INVOICE</strong></p><p class=\"ql-align-right ql-font-roboto\"><span style=\"font-size: 11px; color: rgb(100, 116, 139);\">No. </span><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;invoice.number&gt;&gt;\" data-type=\"text\" data-name=\"invoice.number\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[invoice.number]</span>﻿</span></p>",
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "INVOICE",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "align": "right",
                        "color": "#1d4ed8"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "right"
                },
                {
                  "elements": [
                    {
                      "value": "No. ",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 11,
                        "font": "Roboto",
                        "align": "right",
                        "color": "#64748b"
                      },
                      "type": "text"
                    },
                    {
                      "value": "<<invoice.number>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "align": "right",
                        "value": "<<invoice.number>>",
                        "type": "text",
                        "currentColumnName": "invoice.number",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "right"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Billing",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 13,
                        "font": "Roboto",
                        "color": "#1d4ed8",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
          }
        ],
        "backgroundColor": "white"
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
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;color: rgb(71, 85, 105);\"><strong style=\"font-size: 10px;\">Bill To</strong></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;customer.name&gt;&gt;\" data-type=\"text\" data-name=\"customer.name\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">text[customer.name]</span>﻿</span>﻿</span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;customer.address1&gt;&gt;\" data-type=\"text\" data-name=\"customer.address1\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">text[customer.address1]</span>﻿</span>﻿</span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;customer.city&gt;&gt;\" data-type=\"text\" data-name=\"customer.city\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">text[customer.city]</span>﻿</span>﻿</span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;customer.postcode&gt;&gt;\" data-type=\"text\" data-name=\"customer.postcode\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">text[customer.postcode]</span>﻿</span>﻿</span></p>",
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Bill To",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 10,
                        "font": "Roboto",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "<<customer.name>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<customer.name>>",
                        "type": "text",
                        "currentColumnName": "customer.name",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "<<customer.address1>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<customer.address1>>",
                        "type": "text",
                        "currentColumnName": "customer.address1",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "<<customer.city>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<customer.city>>",
                        "type": "text",
                        "currentColumnName": "customer.city",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "<<customer.postcode>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<customer.postcode>>",
                        "type": "text",
                        "currentColumnName": "customer.postcode",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:12px;color: rgb(71, 85, 105);\"><strong style=\"font-size: 10px;\">Ship To</strong></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;shipping.name&gt;&gt;\" data-type=\"text\" data-name=\"shipping.name\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">text[shipping.name]</span>﻿</span>﻿</span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;shipping.address1&gt;&gt;\" data-type=\"text\" data-name=\"shipping.address1\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">text[shipping.address1]</span>﻿</span>﻿</span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;shipping.city&gt;&gt;\" data-type=\"text\" data-name=\"shipping.city\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">text[shipping.city]</span>﻿</span>﻿</span></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;shipping.postcode&gt;&gt;\" data-type=\"text\" data-name=\"shipping.postcode\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">text[shipping.postcode]</span>﻿</span>﻿</span></p>",
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Ship To",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 10,
                        "font": "Roboto",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "<<shipping.name>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<shipping.name>>",
                        "type": "text",
                        "currentColumnName": "shipping.name",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "<<shipping.address1>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<shipping.address1>>",
                        "type": "text",
                        "currentColumnName": "shipping.address1",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "<<shipping.city>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<shipping.city>>",
                        "type": "text",
                        "currentColumnName": "shipping.city",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "<<shipping.postcode>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<shipping.postcode>>",
                        "type": "text",
                        "currentColumnName": "shipping.postcode",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
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
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:11px;color: rgb(100, 116, 139);\"><strong style=\"font-size: 10px;\">Invoice No.</strong></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;invoice.number&gt;&gt;\" data-type=\"text\" data-name=\"invoice.number\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[invoice.number]</span>﻿</span></p>",
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Invoice No.",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 10,
                        "font": "Roboto",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "<<invoice.number>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<invoice.number>>",
                        "type": "text",
                        "currentColumnName": "invoice.number",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:11px;color: rgb(100, 116, 139);\"><strong style=\"font-size: 10px;\">Invoice Date</strong></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;invoice.date&gt;&gt;\" data-type=\"text\" data-name=\"invoice.date\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[invoice.date]</span>﻿</span></p>",
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Invoice Date",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 10,
                        "font": "Roboto",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "<<invoice.date>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<invoice.date>>",
                        "type": "text",
                        "currentColumnName": "invoice.date",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
          },
          {
            "type": "html",
            "value": "<p class=\"ql-font-roboto\" style=\"font-size:11px;color: rgb(100, 116, 139);\"><strong style=\"font-size: 10px;\">Due Date</strong></p><p class=\"ql-font-roboto\" style=\"font-size:12px;\"><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;invoice.dueDate&gt;&gt;\" data-type=\"text\" data-name=\"invoice.dueDate\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[invoice.dueDate]</span>﻿</span></p>",
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Due Date",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 10,
                        "font": "Roboto",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "<<invoice.dueDate>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<invoice.dueDate>>",
                        "type": "text",
                        "currentColumnName": "invoice.dueDate",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
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
            },
            "block": {
              "blocks": []
            },
            "errorMessage": "",
            "hasError": false
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
            },
            "block": {
              "blocks": []
            },
            "errorMessage": "",
            "hasError": false
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Line Items",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 13,
                        "font": "Roboto",
                        "color": "#1d4ed8",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
          }
        ],
        "backgroundColor": "white"
      },
      {
        "height": 0,
        "widths": [
          49.85,
          15,
          15.15,
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Description",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 11,
                        "font": "Roboto",
                        "color": "#64748b",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Qty",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 11,
                        "font": "Roboto",
                        "align": "right",
                        "color": "#64748b"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "right"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Unit",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 11,
                        "font": "Roboto",
                        "align": "right",
                        "color": "#64748b"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "right"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Amount",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 11,
                        "font": "Roboto",
                        "align": "right",
                        "color": "#64748b"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "right"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
          }
        ],
        "backgroundColor": "white"
      },
      {
        "height": 50,
        "widths": [
          49.78,
          15.15,
          15,
          20.07
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;description&gt;&gt;\" data-type=\"text\" data-name=\"description\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[description]</span>﻿</span></p>",
            "attrs": {
              "paddingTop": 5,
              "paddingRight": 5,
              "paddingBottom": 5,
              "paddingLeft": 5,
              "borderTop": 0,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#D1D5DB",
              "backgroundColor": "transparent"
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "<<description>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<description>>",
                        "type": "text",
                        "currentColumnName": "description",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false,
            "barcodeBlock": null,
            "chartBlock": null,
            "imageBlock": null
          },
          {
            "type": "html",
            "value": "<p><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;qty&gt;&gt;\" data-type=\"number\" data-name=\"qty\" contenteditable=\"false\">﻿<span contenteditable=\"false\">number[qty]</span>﻿</span></p>",
            "attrs": {
              "paddingTop": 5,
              "paddingRight": 5,
              "paddingBottom": 5,
              "paddingLeft": 5,
              "borderTop": 0,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#D1D5DB",
              "backgroundColor": "transparent"
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "<<qty>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<qty>>",
                        "type": "number",
                        "currentColumnName": "qty",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false,
            "barcodeBlock": null,
            "chartBlock": null,
            "imageBlock": null
          },
          {
            "type": "html",
            "value": "<p><span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;unit&gt;&gt;\" data-type=\"text\" data-name=\"unit\" contenteditable=\"false\">﻿<span contenteditable=\"false\">text[unit]</span>﻿</span></p>",
            "attrs": {
              "paddingTop": 5,
              "paddingRight": 5,
              "paddingBottom": 5,
              "paddingLeft": 5,
              "borderTop": 0,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#D1D5DB",
              "backgroundColor": "transparent"
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "<<unit>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<unit>>",
                        "type": "text",
                        "currentColumnName": "unit",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false,
            "barcodeBlock": null,
            "chartBlock": null,
            "imageBlock": null
          },
          {
            "type": "html",
            "value": "<p>£<span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;amount&gt;&gt;\" data-type=\"number\" data-name=\"amount\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">number[amount]</span>﻿</span>﻿</span></p>",
            "attrs": {
              "paddingTop": 5,
              "paddingRight": 5,
              "paddingBottom": 5,
              "paddingLeft": 5,
              "borderTop": 0,
              "borderRight": 1,
              "borderBottom": 1,
              "borderLeft": 1,
              "borderColor": "#D1D5DB",
              "backgroundColor": "transparent"
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "£",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "align": "left"
                      },
                      "type": "text"
                    },
                    {
                      "value": "<<amount>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "value": "<<amount>>",
                        "type": "number",
                        "currentColumnName": "amount",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false,
            "barcodeBlock": null,
            "chartBlock": null,
            "imageBlock": null
          }
        ],
        "backgroundColor": "white",
        "repeatableToken": {
          "name": "invoice.lineItems",
          "value": "[object Object],[object Object]",
          "type": "json_array",
          "tokenAttributes": [
            {
              "name": "description",
              "value": "[\"Car Model A\",\"Car Model B\"]",
              "valueArray": [
                "Car Model A",
                "Car Model B"
              ],
              "type": "text"
            },
            {
              "name": "qty",
              "value": "[\"2\",\"3\"]",
              "valueArray": [
                "2",
                "3"
              ],
              "type": "number"
            },
            {
              "name": "unit",
              "value": "[\"Type X\",\"Type Y\"]",
              "valueArray": [
                "Type X",
                "Type Y"
              ],
              "type": "text"
            },
            {
              "name": "amount",
              "value": "[\"600\",\"420\"]",
              "valueArray": [
                "600",
                "420"
              ],
              "type": "number"
            },
            {
              "name": "text_car",
              "value": "[\"Car Model A\",\"Car Model B\"]",
              "valueArray": [
                "Car Model A",
                "Car Model B"
              ],
              "type": "text"
            },
            {
              "name": "text_type",
              "value": "[\"Type X\",\"Type Y\"]",
              "valueArray": [
                "Type X",
                "Type Y"
              ],
              "type": "text"
            },
            {
              "name": "text_year_start",
              "value": "[\"2023\",\"2022\"]",
              "valueArray": [
                "2023",
                "2022"
              ],
              "type": "text"
            },
            {
              "name": "text_year_end",
              "value": "[\"2024\",\"2023\"]",
              "valueArray": [
                "2024",
                "2023"
              ],
              "type": "text"
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
            },
            "block": {
              "blocks": []
            },
            "errorMessage": "",
            "hasError": false
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Notes",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 10,
                        "font": "Roboto",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "Payment due within 14 days. Thank you for your business.",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
          },
          {
            "type": "html",
            "value": "<p class=\"ql-align-right ql-font-roboto\" style=\"font-size:12px;\"><strong>Subtotal</strong> £<span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;invoice.subtotal&gt;&gt;\" data-type=\"number\" data-name=\"invoice.subtotal\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">number[invoice.subtotal]</span>﻿</span>﻿</span>﻿</span></p><p class=\"ql-align-right ql-font-roboto\" style=\"font-size:12px;\">VAT (20%) £<span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;invoice.vat&gt;&gt;\" data-type=\"number\" data-name=\"invoice.vat\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">number[invoice.vat]</span>﻿</span>﻿</span>﻿</span></p><p class=\"ql-align-right ql-font-roboto\" style=\"font-size:13px;color: rgb(29, 78, 216);\"><strong style=\"color: rgb(29, 78, 216);\">Total £<span class=\"ql-mathjax custom-token\" data-value=\"&lt;&lt;invoice.total&gt;&gt;\" data-type=\"number\" data-name=\"invoice.total\" contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">﻿<span contenteditable=\"false\">number[invoice.total]</span>﻿</span>﻿</span>﻿</span></strong></p>",
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Subtotal",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "align": "right"
                      },
                      "type": "text"
                    },
                    {
                      "value": " £",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "align": "right"
                      },
                      "type": "text"
                    },
                    {
                      "value": "<<invoice.subtotal>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "align": "right",
                        "value": "<<invoice.subtotal>>",
                        "type": "number",
                        "currentColumnName": "invoice.subtotal",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "right"
                },
                {
                  "elements": [
                    {
                      "value": "VAT (20%) £",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "align": "right"
                      },
                      "type": "text"
                    },
                    {
                      "value": "<<invoice.vat>>",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "align": "right",
                        "value": "<<invoice.vat>>",
                        "type": "number",
                        "currentColumnName": "invoice.vat",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "right"
                },
                {
                  "elements": [
                    {
                      "value": "Total £",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "align": "right",
                        "color": "#1d4ed8"
                      },
                      "type": "text"
                    },
                    {
                      "value": "<<invoice.total>>",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "align": "right",
                        "color": "#1d4ed8",
                        "value": "<<invoice.total>>",
                        "type": "number",
                        "currentColumnName": "invoice.total",
                        "isCustomElement": true,
                        "isMergeField": true
                      },
                      "type": "token"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "right"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false,
            "barcodeBlock": null,
            "chartBlock": null,
            "imageBlock": null
          }
        ],
        "backgroundColor": "white"
      },
      {
        "height": 0,
        "widths": [
          57.31,
          42.69
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "Pay Online",
                      "attributes": {
                        "bold": "true",
                        "italic": "false",
                        "underline": "false",
                        "size": 12,
                        "font": "Roboto",
                        "color": "#1d4ed8",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                },
                {
                  "elements": [
                    {
                      "value": "Scan the code or visit the link in your email to complete payment securely.",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 14,
                        "font": "Roboto",
                        "align": "left"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "left"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
          },
          {
            "type": "barcode",
            "value": "",
            "barcodeBlock": {
              "imageBase64": "data:image/png;base64,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",
              "filename": "[token:invoice.website]",
              "width": 70,
              "alignment": "right",
              "HtmlTokenElement": {
                "key": "invoice.website",
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
            },
            "block": {
              "blocks": []
            },
            "errorMessage": "",
            "hasError": false,
            "imageBlock": null,
            "chartBlock": null
          }
        ],
        "backgroundColor": "white"
      }
    ]
  },
  "footer": {
    "rows": [
      {
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
            },
            "block": {
              "blocks": [
                {
                  "elements": [
                    {
                      "value": "NOVA SUPPLY CO. · 221B Market Street, London · (020) 1234 5678",
                      "attributes": {
                        "bold": "false",
                        "italic": "false",
                        "underline": "false",
                        "size": 11,
                        "font": "Roboto",
                        "align": "center",
                        "color": "#64748b"
                      },
                      "type": "text"
                    }
                  ],
                  "blockType": "p",
                  "alignment": "center"
                }
              ]
            },
            "errorMessage": "",
            "hasError": false
          }
        ],
        "backgroundColor": "white"
      }
    ]
  },
  "pageAttrs": {
    "marginTop": 35,
    "marginRight": 30,
    "marginLeft": 30,
    "marginBottom": 24,
    "headerMarginTop": 5,
    "headerMarginRight": 0,
    "headerMarginLeft": 0,
    "headerMarginBottom": 5,
    "headerHeight": 60,
    "footerMarginTop": 5,
    "footerMarginRight": 30,
    "footerMarginLeft": 30,
    "footerMarginBottom": 5,
    "footerHeight": 40,
    "backgroundColor": "white",
    "defaultFont": "Roboto",
    "dontBreakRows": true,
    "pageNumbering": true
  },
  "tokenAttrs": [
    {
      "name": "customer.name",
      "value": "Alexandra Mills",
      "type": "text"
    },
    {
      "name": "customer.address1",
      "value": "71 Riverbank Way",
      "type": "text"
    },
    {
      "name": "customer.city",
      "value": "London",
      "type": "text"
    },
    {
      "name": "customer.postcode",
      "value": "SW1A 1AA",
      "type": "text"
    },
    {
      "name": "shipping.name",
      "value": "Alexandra Mills",
      "type": "text"
    },
    {
      "name": "shipping.address1",
      "value": "71 Riverbank Way",
      "type": "text"
    },
    {
      "name": "shipping.city",
      "value": "London",
      "type": "text"
    },
    {
      "name": "shipping.postcode",
      "value": "SW1A 1AA",
      "type": "text"
    },
    {
      "name": "invoice.company",
      "value": "NOVA SUPPLY CO.",
      "type": "text"
    },
    {
      "name": "invoice.website",
      "value": "www.novasupply.example",
      "type": "text"
    },
    {
      "name": "invoice.email",
      "value": "support@nova.example",
      "type": "text"
    },
    {
      "name": "invoice.number",
      "value": "INV-2025-0087",
      "type": "text"
    },
    {
      "name": "invoice.date",
      "value": "2025-03-14",
      "type": "text"
    },
    {
      "name": "invoice.dueDate",
      "value": "2025-03-28",
      "type": "text"
    },
    {
      "name": "invoice.lineItems",
      "value": "[object Object],[object Object]",
      "type": "json_array",
      "tokenAttributes": [
        {
          "name": "description",
          "value": "[\"Car Model A\",\"Car Model B\"]",
          "valueArray": [
            "Car Model A",
            "Car Model B"
          ],
          "type": "text"
        },
        {
          "name": "qty",
          "value": "[\"2\",\"3\"]",
          "valueArray": [
            "2",
            "3"
          ],
          "type": "number"
        },
        {
          "name": "unit",
          "value": "[\"Type X\",\"Type Y\"]",
          "valueArray": [
            "Type X",
            "Type Y"
          ],
          "type": "text"
        },
        {
          "name": "amount",
          "value": "[\"600\",\"420\"]",
          "valueArray": [
            "600",
            "420"
          ],
          "type": "number"
        },
        {
          "name": "text_car",
          "value": "[\"Car Model A\",\"Car Model B\"]",
          "valueArray": [
            "Car Model A",
            "Car Model B"
          ],
          "type": "text"
        },
        {
          "name": "text_type",
          "value": "[\"Type X\",\"Type Y\"]",
          "valueArray": [
            "Type X",
            "Type Y"
          ],
          "type": "text"
        },
        {
          "name": "text_year_start",
          "value": "[\"2023\",\"2022\"]",
          "valueArray": [
            "2023",
            "2022"
          ],
          "type": "text"
        },
        {
          "name": "text_year_end",
          "value": "[\"2024\",\"2023\"]",
          "valueArray": [
            "2024",
            "2023"
          ],
          "type": "text"
        }
      ]
    },
    {
      "name": "invoice.notes",
      "value": "Payment due within 14 days. Thank you for your business.",
      "type": "text"
    },
    {
      "name": "invoice.subtotal",
      "value": "1020",
      "type": "number"
    },
    {
      "name": "invoice.vat",
      "value": "204",
      "type": "number"
    },
    {
      "name": "invoice.total",
      "value": "1224",
      "type": "number"
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
