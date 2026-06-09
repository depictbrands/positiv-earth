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
    image {
      asset,
      alt
    }
  }
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
