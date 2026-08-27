import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { useMoney } from "~/composables/useMoney";

describe("useMoney", () => {
  it("formats a positive amount as BRL currency", () => {
    const { formatted } = useMoney(ref(1234.56));
    expect(formatted.value).toBe("R$\u00A01.234,56");
  });

  it("formats zero as BRL currency", () => {
    const { formatted } = useMoney(ref(0));
    expect(formatted.value).toBe("R$\u00A00,00");
  });

  it("formats a negative amount as BRL currency", () => {
    const { formatted } = useMoney(ref(-50));
    expect(formatted.value).toBe("-R$\u00A050,00");
  });

  it("builds an aria label with plural reais and centavos", () => {
    const { ariaLabel } = useMoney(ref(1234.56));
    expect(ariaLabel.value).toBe("1234 reais e 56 centavos");
  });

  it("builds an aria label using singular 'real' for amount of 1", () => {
    const { ariaLabel } = useMoney(ref(1));
    expect(ariaLabel.value).toBe("1 real");
  });

  it("builds an aria label using singular 'centavo' for 1 cent", () => {
    const { ariaLabel } = useMoney(ref(0.01));
    expect(ariaLabel.value).toBe("0 reais e 1 centavo");
  });

  it("omits centavos label when there are no cents", () => {
    const { ariaLabel } = useMoney(ref(10));
    expect(ariaLabel.value).toBe("10 reais");
  });

  it("prefixes with 'menos' for negative amounts", () => {
    const { ariaLabel } = useMoney(ref(-25.5));
    expect(ariaLabel.value).toBe("menos 25 reais e 50 centavos");
  });

  it("handles zero amount aria label", () => {
    const { ariaLabel } = useMoney(ref(0));
    expect(ariaLabel.value).toBe("0 reais");
  });

  it("reacts to ref updates", () => {
    const amount = ref(10);
    const { formatted, ariaLabel } = useMoney(amount);

    expect(formatted.value).toBe("R$\u00A010,00");
    expect(ariaLabel.value).toBe("10 reais");

    amount.value = 20.25;

    expect(formatted.value).toBe("R$\u00A020,25");
    expect(ariaLabel.value).toBe("20 reais e 25 centavos");
  });
});
