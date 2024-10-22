
export function GetImageUrl(avatar: string | null){
  return avatar && avatar.length > 0 ? `data:image/jpeg;base64,${avatar}` : null;
}

export function GetInitials(firstName: string, lastName: string) {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
