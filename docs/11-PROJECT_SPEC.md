# Fémi & Ifeoma Cat Café — Project Specification

**Version:** 1.0
**Date:** 2024-08-03
**Status:** Draft — confirm with client before Phase 3 begins

---

## Overview

A full website and booking system for Fémi & Ifeoma Cat Café — Lagos's first cat café. The site must communicate the brand, drive bookings, and support the community-first identity of the business.

**Live URL:** www.femiandifeomacatcafe.com
**Instagram:** @femiandifeoma

---

## Business Goals

1. Drive online bookings (primary conversion goal)
2. Establish the brand as a premium lifestyle destination, not just a café
3. Communicate the experience to first-time visitors (many will be unfamiliar with cat cafés)
4. Support social media growth and content sharing
5. Reduce inbound WhatsApp/DM booking enquiries by providing self-serve booking

---

## Target Audience

**Primary:** Lagosians aged 18–40 looking for a social, calm, and memorable outing
**Secondary:** Cat lovers, pet parents, content creators, remote workers seeking a third space
**Tertiary:** Tourists and expats in Lagos

---

## Pages

### 1. Home (/)
The primary landing page. Must convert a first-time visitor into a booking.

**Sections (in order):**
- Navbar
- Hero: Headline + CTA button + cat photography
- Brand story: "Relax, Purr & Community" narrative
- How it works: 3-step (Book → Visit → Enjoy)
- Meet our cats: 3–6 featured cat profiles
- Testimonials or social proof (Instagram embeds or quotes)
- Footer

**Primary CTA:** "Book a Visit" → /book

---

### 2. About (/about)
Builds trust and tells the story.

**Sections:**
- Who we are (brand narrative)
- Our cats (brief intro, links to /our-cats)
- The team / founders
- Our space (interior photography)
- Mission and values

---

### 3. Our Cats (/our-cats)
Full directory of resident cats.

**Content per cat:**
- Name
- Breed
- Personality traits (e.g. "Playful", "Shy", "Cuddly")
- Photo (circular or rounded)
- Short bio

---

### 4. FAQs (/faqs)
Answers the questions that would otherwise stop someone from booking.

**Topics to cover:**
- What is a cat café?
- Do I need to book in advance?
- Is it safe for children?
- What if I'm allergic to cats?
- Can I touch/hold the cats?
- How long can I stay?
- Do you serve food and drink?
- What's the pricing?
- Is the café wheelchair accessible?

---

### 5. House Rules (/house-rules)
Non-negotiable but written in warm brand voice.

**Rules to include:**
- No picking up cats unless they come to you
- Quiet voices indoors
- No flash photography
- Children must be supervised
- No outside food or drink
- Respect the cats' space
- Wash hands before and after

---

### 6. Book (/book)
The primary conversion page.

**Flow:**
1. Select date (calendar view)
2. Select time slot
3. Enter details (name, email, phone, party size)
4. Review booking summary
5. Pay (Paystack)
6. Confirmation page + email confirmation

**Edge cases to handle:**
- Fully booked dates (greyed out)
- Closed days (Sunday — confirm with client)
- Max party size (confirm with client — likely 8–10)
- Last-minute bookings (same-day cutoff time — confirm)
- Cancellation policy (confirm with client)

---

## Functional Requirements

| Feature | Required | Notes |
|---|---|---|
| Online booking | ✅ | Self-serve, no phone required |
| Payment processing | ✅ | Paystack (Nigerian-native) |
| Email confirmation | ✅ | Automated on booking |
| Cat profiles | ✅ | Static or CMS-managed |
| FAQ accordion | ✅ | |
| Instagram feed embed | 🟡 Optional | Can use static screenshots initially |
| Admin booking view | 🟡 Phase 2 | To manage reservations |
| Cancellation flow | 🟡 Phase 2 | Link in confirmation email |
| Blog/news section | ⬜ Not required | Future roadmap |
| Merchandise store | ⬜ Not required | Future roadmap |

---

## Non-Functional Requirements

| Requirement | Target |
|---|---|
| Mobile performance (Lighthouse) | ≥ 85 |
| Desktop performance (Lighthouse) | ≥ 90 |
| Core Web Vitals | All green |
| Accessibility | WCAG AA |
| Page load (mobile, 4G) | < 3 seconds |
| Uptime | 99.9% |
| SSL | Required |

---

## Booking Workflow

```
User lands on /book
        ↓
Select available date (calendar)
        ↓
Select time slot (pills: 10AM, 11AM, 12PM, 1PM, 2PM, 3PM, 4PM)
        ↓
Enter details (name, email, phone, party size)
        ↓
Review summary
        ↓
Pay via Paystack
        ↓
Booking confirmed → email sent → redirect to /book/confirmation/:id
```

---

## Pricing (confirm with client)

TBC. Website should dynamically pull pricing from backend or be easily updatable.
Likely structure:
- Per person, per session
- Possible: weekday vs weekend pricing
- Children pricing (if applicable)

---

## Success Criteria

The project is complete when:

1. All 5 phases in `05-IMPLEMENTATION_PLAN.md` are marked complete
2. Lighthouse mobile score ≥ 85
3. Booking flow works end-to-end in production
4. Payment processing confirmed working with Paystack
5. Email confirmations sent and received
6. Site passes brand consistency review against brand guide
7. All WCAG AA contrast checks pass
8. Site loads in < 3 seconds on 4G mobile

---

## Out of Scope (v1)

- Admin dashboard / back-office
- Cancellation self-serve flow
- Blog / content management
- Merchandise store
- Loyalty programme ("Cat Passport" digital version)
- Multi-location support

---

## Future Roadmap

- Admin panel for managing bookings and availability
- Cancellation and rescheduling flow
- Loyalty/stamp card system (digital Cat Passport)
- Instagram content scheduling integration
- Merchandise store (socks, tote bags, cat bowls seen in brand guide)
- Second location support (if business expands)
