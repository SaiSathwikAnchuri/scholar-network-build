exports.generateAvatar = name => {
  // Return a URL to a placeholder avatar, e.g. by using ui-avatars.com
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
};
