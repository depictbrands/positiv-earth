export const HOME_PAGE_QUERY = `*[_type == "homePage" && _id == "homePage"][0]{
  hero {
    headlinePre,
    headlineEmphasis,
    headlinePost,
    subcopy,
    backgroundImage {
      asset,
      alt
    }
  },
  brandStory {
    heading,
    emphasizedWord,
    body,
    image {
      asset,
      alt
    },
    cta {
      label,
      href
    }
  },
  howItWorks {
    heading,
    emphasizedWord,
    steps,
    body,
    image {
      asset,
      alt
    },
    cta {
      label,
      href
    }
  },
  destinations {
    heading,
    destinations[] {
      name,
      durationDays,
      locations,
      href,
      image {
        asset,
        alt
      }
    }
  },
  testimonial {
    heading,
    testimonials[] {
      name,
      quote,
      avatar {
        asset,
        alt
      }
    }
  },
  cta {
    heading,
    buttonLabel,
    buttonHref,
    image {
      asset,
      alt
    }
  }
}`;

export const SERVICES_PAGE_QUERY = `*[_type == "servicesPage" && _id == "servicesPage"][0]{
  hero {
    headline,
    backgroundImage {
      asset,
      alt
    }
  },
  threeServices {
    services[] {
      title,
      description,
      image {
        asset,
        alt
      }
    }
  }
}`;

export const FAQ_PAGE_QUERY = `*[_type == "faqPage" && _id == "faqPage"][0]{
  hero {
    headline,
    backgroundImage {
      asset,
      alt
    }
  },
  faq {
    heading,
    items[] {
      question,
      answer
    }
  }
}`;

const ABOUT_SCENE_PROJECTION = `{
  headline,
  body,
  images[] {
    asset,
    alt
  }
}`;

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage" && _id == "aboutPage"][0]{
  hero {
    lead,
    name,
    role,
    backgroundImage {
      asset,
      alt
    }
  },
  intro {
    stats[] {
      emphasis,
      rest
    },
    portrait {
      asset,
      alt
    }
  },
  sceneA ${ABOUT_SCENE_PROJECTION},
  sceneB ${ABOUT_SCENE_PROJECTION},
  sceneC ${ABOUT_SCENE_PROJECTION},
  cta {
    heading,
    buttonLabel,
    buttonHref,
    image {
      asset,
      alt
    }
  }
}`;

export const QUIZ_PAGE_QUERY = `*[_type == "designYourTravelPage" && _id == "designYourTravelPage"][0]{
  title,
  backgroundImage {
    asset,
    alt
  },
  totalSteps,
  questions[] {
    _type,
    _key,
    id,
    prompt,
    options[] {
      id,
      label,
      icon,
      branch
    },
    travelerCount {
      prompt,
      adultsLabel,
      adultsPlaceholder,
      addChildrenLabel,
      childrenLabel,
      childAgePlaceholder
    },
    columns,
    choices[] {
      id,
      label,
      image {
        asset,
        alt
      }
    },
    firstNameLabel,
    lastNameLabel,
    phoneLabel,
    emailLabel,
    countryLabel,
    countryOptions,
    notesLabel
  },
  successTitle,
  successMessage
}`;

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage" && _id == "contactPage"][0]{
  hero {
    headline,
    backgroundImage {
      asset,
      alt
    }
  },
  info {
    name,
    email,
    phone,
    socials[] {
      platform,
      url
    },
    photos[] {
      asset,
      alt
    }
  }
}`;

const IMAGE_WITH_ALT = `{
  asset,
  alt
}`;

const ITINERARY_DAY_DETAIL = `{
  city,
  periods[] {
    name,
    meal,
    mealPlace,
    mealIncluded,
    activity
  }
}`;

export const ITINERARY_BY_SLUG_QUERY = `*[_type == "itinerary" && slug.current == $slug][0]{
  title,
  "slug": slug.current,
  accentColor,
  hero {
    country,
    title,
    durationDays,
    nights,
    travelers,
    backgroundImage ${IMAGE_WITH_ALT}
  },
  overview {
    heading,
    highlights,
    mapImage ${IMAGE_WITH_ALT},
    process[] {
      title,
      description
    }
  },
  timeline {
    heading,
    days[] {
      dayLabel,
      daySummary,
      date,
      headline,
      body,
      image ${IMAGE_WITH_ALT},
      detail ${ITINERARY_DAY_DETAIL}
    }
  },
  localFood {
    heading,
    tagline,
    body,
    heroImage ${IMAGE_WITH_ALT},
    galleryImages[] ${IMAGE_WITH_ALT}
  },
  accommodation {
    heading,
    cities[] {
      id,
      label,
      hotels[] {
        name,
        image ${IMAGE_WITH_ALT}
      }
    }
  },
  whatsIncluded {
    heading,
    includesHeading,
    notIncludesHeading,
    includes,
    notIncludes
  },
  nextItineraries {
    headingLeading,
    headingTrailing,
    editorialSlugs
  }
}`;

export const ITINERARY_SLUGS_QUERY = `*[_type == "itinerary" && defined(slug.current)]{
  "slug": slug.current
}`;

export const HOME_DESTINATIONS_QUERY = `*[_type == "homePage" && _id == "homePage"][0].destinations.destinations[]{
  name,
  durationDays,
  locations,
  href,
  image {
    asset,
    alt
  }
}`;
