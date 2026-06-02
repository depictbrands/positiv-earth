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
