export default function removeDiacritics(input?: string) {

    if (!input) {
        return '';
    }

    return input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}
