// src/app/presets/invoice.preset.ts
import { Page } from '../models/page';

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
            "value": "<p><span class=\"ql-color-brown\" style=\"font-size:16px;\">Field Trip Permission &amp; Safety</span></p><p><span class=\"ql-color-slate\" style=\"font-size:10px;\">Please complete and return to homeroom teacher</span></p>",
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
              "imageBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALUAAACUCAMAAADifZgIAAABI1BMVEX///9Bh7X/vzEZz7r6boUAz71ChLUX0bqKyZL/wixukqI8hrf/wxn/vys9h7S8qXH6aIn/uQD/9eaWnI/6a4cV1Lr8k2ZEgLX9olUnfK/6ZIz7hXL/uzH/4qr+uDo0pLe1zd/+qE/9nVkiwrknurkdybo6lrYqtbg8krY2nrcxqLf7env/bYLr9vdm2Mo+jbWfvtZxosXG2Ob6dIH8i2/+sUOP39ax6OLa8vHI7ukur7d/qcZE0sLf6fH9l2H9nauf29pZlL1ejql/k4+OvJB7xpdRyqKvpHbetU/hwEXMxWz/7Mj/1on/x0/Fq2Ptu0CooYL/y2D5zXbVsV2wvsL+xsHscIr8sr7/3uXVdJGPf6b9xs55gapghLDDd5f8iJqlfJ8T68AtAAAJ8klEQVR4nO2ce3vaRhaHI8CaKjIqpAgi2+ViIUAYGYwXMNjYcfbSdtNsN+luUufS7ff/FDtCQtKMZkYjIRB9Hn7/tJ0C8+r46Mw5Z6R59uyggw466KCD9luWo6wxeGXNZ7PpdHrpCP7bdDa/yRqKJesGwt7lbYE8gIL/BPZ/3d1dTuf7aHdIfAccRqLg/zm6nO+Vy1hzG5lKvAYHEHy2L94C/eIoitg3+d10ljUw1PySl9gHf5UtsjU3Ih2DCD7N0MFnd0mYIbWqGq8y4l7eJjI0vCv1RcPsXDWzgB4JYl9NYme9o4hQsnC13DXzWNAEQWnHNTYARqcmCo5kbbRT5uVIs6cVO/k42EAFel9YM9vSrsa7gx4/ys6sYpdBDRCpKjDa5jDIbJtb2Jm5R4ILLYg9omdDRKgjXdfbbd1Ru9vvDAWMecV9u5tgcqX5c9bCng1d1+j2TaWGiUDseImwAy9Zrr3DMXYHpwbGogcRaYwEyUpz29BjBBqGkVDMbsQhdrDlLWMvZRmbUkepgR6XecW91XtyrIUmxBwbLGoJqIVtRu4xYT6cup+IeovYYwF3DyHsId041KKnWm1L2GGfhhriIaTN7ddiTTH7i0W/3280Gv1Fe7odaMLMNTyBAkaPE1ts6GpQAGyhyLGuSNRiKPCBLqepu2pogUof+5YALYoLwtLYJS3cuGoE6LyR9uLeDMc8oUZMnmDSH73O1ExiTX+ZLvQShxYFpddVyVWBmu9EYItDnZgsglSxLQX1D1HoLHRA+Bu7kxsR2GKf9tU0XRtz6lqnazC7NkBXmNQUU0Pdpefa2JooLvJRnSZ1wTR2KFP0lVrUxpLToRFd5II8a4lklcmpRe1R8Fak3Ui4sZnUrCrZSAcaXRQVVqkYoGZ5SI3ZSEnHR24RU5t8ZTnL1uKQ6WJ3abRd0Zxa4fIP6J50ajFc/6RvbDTqMe5+xNTUhFUUzKgLT8HYaNQTF1xNMpWW+Ym1Tvso8sI3N/YIMTX7PsrbWYiddXbJ0GKt144M9bY2hV6i8zLuI2dXxtDbC1MkNT9EYWga1CQA/alNjY3E6nAR4M1j98MWDXOoiOR+jZ25cDLnN47ZWNpUI95I0Cn0hen0d4neDBNxs83OXDBttkBirYShQWLOdztDKvDqYod87uxrs4wV7TTBJSbEDPRGLaIsF8klAEsbBT8LNXW44AJGP7reUmJ1uR1t4iJNrKmHu7WqR1Uttn/wxXjUGpcb5Nnouih2sGjN2UbgTAIQGcldZPmIOghWNwEdb/2TFLpWPmPPE1M30fmxJDWyOnSpG/GZN1po0NUcr/bUBleXidAz4VHiAtLCitwe8rNql7M1low6n9Sxcbc2g7EAtPEyXKaomz9KoMSxL1SaB6hDTi3Lr//6HVF/+yaB/v6PpMsj1iUTu0FqzKnl4Q8/5qRiasr99M83yahHGHWgssadWn79E5wpTUHynxNRY73fADXQ0dRDVnJSqswrld++iA9tYZt0vl+H1kT5X1uAtrETUON91HUMAXncqZ//kq57eNjfb06t6CtsgN+JgvzvrZgaOnd8Hwn3rJUurAqO9CGeT8vfbsfUEDu2scNboqI4NM1euGpRAtSSK2Ry4mCOY7D4Lq6xSZsa5NIwQC1NXq7UCsJIdXcwGGm8wTPWYGxjk6jJ8qml+4Kr0wBKyxusS/7g9Xpw4mNP1oMX7mDx3fappUllDVi591lO1oOlqv9HKaw/WvqLf4EXpfXg+qrLMZfIJNTnBY/aY5FaJX/wbD165l1K5aK+Hqz7F11wP1mMGbO3QX26BpTqROqC//319cU09p5QF9//GalzuVjG3hfqeLkf4cGbbKhjLeuhFT0rDym+/97TmzcRlxDKntKgPougrhCoc8UyovcsR7dID4REUE986qo36ZlHXfIHpZK/yviAFxXvUnJUlcvv6Nx4VcBBnZOqJ6WVTnwDwsHSetBfvKXzijt67ecsxZcFd7DQYqWRxdzPVEe54nWRYM7Xqq50fhacxR18WQ/mVJN755P1wFhxcu4MThjMqw9Sb9HRULF7HmJA0dT8mSpzMLLMKBYp2DNg6F33GTAo0zQpewLK1qoCFnaOjD3PA2cjbv0QmL3D1Y+oCnaITV7qb+7Qzpvz+LfRDlVg2VDnisRIYl0S+4qqulDEvaAml2dTSrtTbaP9kIyoKcae0bq0wEB2CbKiLhPzKtyxadiZ2TpHvB/pb6YhneCsqHNlsmMzXrMMPPyWHTU5ilCh4S1pitlTk7slhH1zj7q9t9TUKII8H75v1Bb93dbA45H7Rs24H/fYr2EGRfWQzh7EEFrvkmZsuM7sMTXN2BzUHLk9U9HFAX0HhLI+Ap1NLUn1VqtVTwxelIqTVmtSZH6fTk0xdoStjyen14XC9fXp5DgRtJSrXts/cHHOum7GbhPZ2EFq+Qf8l8+qJ06PoFKqnhEnZMsu1p3vnxQmdGwG9Q2FuudT43tg9VOvBVIoncbHll5W/HbOdYuKzdrZI4eRQOQL7TdWvTlXrZu4vi1NCoEfqFzUaSGKnPO5xia+4h9YZQQN3dudBKEh9llM7OPAn8r+/j2FusxsbROzEeSFB+3H4EZWtYRSxzR2oO/m+kid+Dlab8HzEWLoC5Tq8vBXSfLaZteorSsXManvKxg26YYslt9GtONJSRRAHsKXh9/9Kh27qmCzXhePOeU0TavY90utclhv6a2+tUhBW0UKdVlWXj93VcD04Tmv/vPC1gP2/cF/XxAUxUz2EdDGujnek04hatojUZi0W2eyjzj1bxyERB8JrzXAEMiSnwbopE/s96u87wnuZJ8HGHZS6mcWoctgknusyieM+hNXI1z2DwHATP2QFJq0RALaE31fEWMPPnBZWgi8S48ae/A5OXUYm/rIp/Llgz/toPCVy0GQAwAeAtiDjxtA28fg4FGE9mad8snDHnz4xGVp7IV0D3uwIXR4jQRHPQqD8uUJzmfr969cTh16i/6z+/3/beIeFGyd9nC+Inz54+np9z++iFzuQXr1/7eHh4ePiaNHUPhqw3jEVpEVmfTePUnbPR0i7NuA/dIoH/O2T+KA1kbTVpDfGFsWtg5tLzfYc/pt6uExXNIed3MOEZaTqEdcT+rTLL2j03xC55cBw0zMvLuTk+AyeYm8bQQXyWTQOz2lCmqGvFvJ/Y4BaugdnwgGZQW9G4D41FmcvvZsdQqiZ2+VL4MO2jmbk+6guWfe5m9cau2xmd1piN4JjvGoNTlD5pVWp2WCI26/hqlJVr6B6GZ6yX2iliY/jnYb7Oiy5q+uNC0yv9M0iJxF3KDKWjYhuEZLTWXNRl7u04G7nqzm7dXjyne1QJdDEB4fb0d7ZeOQrOW4ORqNbl2NRs3xeC9NTNGfifWggw466KCDGPo/osVwQvJqBYIAAAAASUVORK5CYII=",
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
            "value": "<p><strong class=\"ql-color-brown\" style=\"font-size:15px;\">Trip Overview</strong></p>",
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
            "value": "<p class=\"ql-color-slate\" style=\"font-size:10px;\"><span style=\"font-size: 10px;\">Destination</span></p><p style=\"font-size:14px;\"><strong>City Science Museum</strong></p>",
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
            "value": "<p class=\"ql-color-slate\" style=\"font-size:10px;\"><span style=\"font-size: 10px;\">Date</span></p><p style=\"font-size:14px;\">22 Nov 2025</p>",
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
            "value": "<p class=\"ql-color-slate\" style=\"font-size:10px;\"><span style=\"font-size: 10px;\">Depart / Return</span></p><p style=\"font-size:14px;\">08:45 → 15:30</p>",
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
            "value": "<p><strong class=\"ql-color-brown\" style=\"font-size:15px;\">Student Details</strong></p>",
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
            "value": "<p class=\"ql-color-slate\" style=\"font-size:10px;\"><span style=\"font-size: 10px;\">Student Name</span></p><p style=\"font-size:14px;\"><strong>Maya Thompson</strong></p>",
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
            "value": "<p class=\"ql-color-slate\" style=\"font-size:10px;\"><span style=\"font-size: 10px;\">Class / Teacher</span></p><p style=\"font-size:14px;\">Year 6 — Ms. Alvarez</p>",
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
            "value": "<p class=\"ql-color-slate\" style=\"font-size:10px;\"><span style=\"font-size: 10px;\">Emergency Contact</span></p><p style=\"font-size:14px;\">E. Thompson · (555) 201-8899</p>",
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
            "value": "<p><strong class=\"ql-color-brown\" style=\"font-size:15px;\">Medical & Dietary</strong></p>",
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
          39.148936170212764,
          30.851063829787236,
          30
        ],
        "cells": [
          {
            "type": "html",
            "value": "<p class=\"ql-color-brown\" style=\"font-size:12px;\"><strong>Allergies</strong></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"font-size: 10px;\">Peanuts — carries EpiPen </span></li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"font-size: 10px;\">Seasonal polle</span></li></ol>",
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
            "value": "<p class=\"ql-color-brown\" style=\"font-size:12px;\"><strong>Medications</strong></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"font-size: 10px;\">None</span></li></ol>",
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
            "value": "<p class=\"ql-color-brown\" style=\"font-size:12px;\"><strong>Dietary Needs</strong></p><ol><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"font-size: 10px;\"> Vegetarian lunch </span></li><li data-list=\"bullet\"><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"font-size: 10px;\"> No sesame products</span></li></ol>",
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
            "value": "<p><strong class=\"ql-color-brown\" style=\"font-size:15px;\">Schedule &amp; Conduct</strong></p>",
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
          56.59574468085106,
          43.40425531914894
        ],
        "cells": [
          {
            "type": "html",
            "value": "<ol class=\"ql-color-slate\" style=\"font-size:13px;line-height:1.6;\"><li><span class=\"ql-ui\" contenteditable=\"false\"></span><strong>Timeline</strong></li><li><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"font-size: 10px;\"> 08:45 — Board bus from North Gate</span></li><li><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"font-size: 10px;\"> 10:00 — Guided exhibits tour</span></li><li><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"font-size: 10px;\"> 12:00 — Lunch at museum courtyard</span></li><li><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"font-size: 10px;\"> 13:00 — Workshop: Renewable Energy</span></li><li><span class=\"ql-ui\" contenteditable=\"false\"></span><span style=\"font-size: 10px;\"> 14:30 — Depart museum</span></li></ol>",
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
            "value": "<p class=\"ql-color-brown\" style=\"font-size:12px;\"><strong>Conduct &amp; Safety</strong></p><p><span style=\"font-size: 10px;\">• Stay with assigned group </span></p><p><span style=\"font-size: 10px;\">• Follow staff instructions </span></p><p><span style=\"font-size: 10px;\">• No food/ drink in exhibithalls </span></p><p><span style=\"font-size: 10px;\">• Report any issue to a teacher immediately</span></p>",
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
            "value": "<p class=\"ql-align-center\"><span class=\"ql-color-slate\" style=\"font-size:11px;\">School policy applies at all times during excursions. Bus provider: City Coaches · (555) 000-4411</span></p>",
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
    "marginTop": 0,
    "marginRight": 24,
    "marginLeft": 24,
    "marginBottom": 24,
    "headerMarginTop": 15,
    "headerMarginRight": 24,
    "headerMarginLeft": 24,
    "headerMarginBottom": 0,
    "headerHeight": 70,
    "footerMarginTop": 5,
    "footerMarginRight": 30,
    "footerMarginLeft": 30,
    "footerMarginBottom": 5,
    "footerHeight": 50,
    "backgroundColor": "white",
    "defaultFont": "Roboto"
  },
  "tokenAttrs": [],
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
